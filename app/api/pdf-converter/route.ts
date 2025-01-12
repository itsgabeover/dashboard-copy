import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { PDFOptions } from 'puppeteer-core';

// Custom error types
interface ConversionError extends Error {
    stack?: string;
}

const PDF_OPTIONS: PDFOptions = {
    format: 'letter',
    printBackground: true,
    margin: {
        top: '0.75in',        // Updated for consistency
        right: '0.5in',
        bottom: '0.75in',     // Updated to accommodate footer
        left: '0.5in'
    },
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
        <div style="font-size: 8pt; width: 100%; padding: 0 0.5in; margin-top: 20px">
            <span style="color: #2d3748;">Confidential</span>
            <span style="float: right;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
    `,
    timeout: 30000
};

export async function POST(request: Request) {
    let browser;
    try {
        if (!request) {
            throw new Error('No request received');
        }

        const html = await getHtmlFromRequest(request);
        if (!html) {
            throw new Error('No HTML content received');
        }

        browser = await puppeteer.launch({
            args: [
                ...chromium.args, 
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--font-render-hinting=none'
            ],
            defaultViewport: {
                width: 1200,
                height: 1553,
                deviceScaleFactor: 2
            },
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(30000);
        await page.setDefaultTimeout(30000);

        // Add CSS for page margin control before setting content
        await page.evaluate(() => {
            const style = document.createElement('style');
            style.textContent = `
                @page {
                    margin: 0.75in 0.5in;
                    size: letter;
                }
                
                body {
                    margin: 0;
                    padding-top: 0.75in;
                    padding-bottom: 0.75in;
                }
                
                .cover {
                    margin-top: -0.75in;
                }
            `;
            document.head.appendChild(style);
        });

        await page.setContent(html, { 
            waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
            timeout: 30000
        });

        await Promise.race([
            Promise.all([
                page.evaluateHandle('document.fonts.ready'),
                page.evaluate(() => {
                    return new Promise((resolve) => {
                        if (document.readyState === 'complete') {
                            resolve(true);
                        } else {
                            window.addEventListener('load', resolve);
                        }
                    });
                })
            ]),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Content loading timeout')), 30000)
            )
        ]);

        const pdfBuffer = await page.pdf(PDF_OPTIONS);

        if (!pdfBuffer || pdfBuffer.length === 0) {
            throw new Error('Generated PDF is empty');
        }

        const filename = `policy_review_${new Date().toISOString().split('T')[0]}.pdf`;
        
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=${filename}`,
                'Cache-Control': 'no-cache'
            }
        });

    } catch (error) {
        const conversionError = error as ConversionError;
        console.error('PDF conversion error:', {
            error: conversionError.message || 'Unknown error',
            stack: conversionError.stack || 'No stack trace',
            timestamp: new Date().toISOString()
        });
        return NextResponse.json(
            { error: 'Failed to convert HTML to PDF', details: conversionError.message || 'Unknown error' },
            { status: 500 }
        );
    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch (closeError) {
                console.error('Browser cleanup failed:', closeError);
            }
        }
    }
}

async function getHtmlFromRequest(request: Request): Promise<string> {
    try {
        const contentType = request.headers.get('content-type');
        
        if (!contentType) {
            throw new Error('Content-Type header is missing');
        }
        
        if (contentType.includes('application/json')) {
            const body = await request.json();
            if (!body.html) {
                throw new Error('HTML content missing in JSON body');
            }
            return body.html;
        } 
        
        if (contentType.includes('text/html')) {
            const html = await request.text();
            if (!html) {
                throw new Error('Empty HTML content');
            }
            return html;
        }
        
        throw new Error('Unsupported Content-Type: ' + contentType);
    } catch (error) {
        const requestError = error as ConversionError;
        console.error('HTML extraction failed:', requestError);
        throw requestError;
    }
}
