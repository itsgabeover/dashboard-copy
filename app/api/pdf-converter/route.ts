import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { PDFOptions } from 'puppeteer-core';

const PDF_OPTIONS: PDFOptions = {
    format: 'letter',
    printBackground: true,
    margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
    },
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
        <div style="
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            font-size: 9pt;
            padding: 0 0.5in;
            width: 100%;
            border-top: 2px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
        ">
            <span style="color: #2d3748;">Confidential</span>
            <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
    `,
    timeout: 30000 // Add timeout
};

export async function POST(request: Request) {
    let browser;
    try {
        // Validate request
        if (!request) {
            throw new Error('No request received');
        }

        // Get HTML content with validation
        const html = await getHtmlFromRequest(request);
        if (!html) {
            throw new Error('No HTML content received');
        }

        // Launch browser with error handling
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
        }).catch(error => {
            console.error('Browser launch failed:', error);
            throw error;
        });

        const page = await browser.newPage();

        // Add request timeout
        await page.setDefaultNavigationTimeout(30000);
        await page.setDefaultTimeout(30000);

        // Set content with error handling
        await page.setContent(html, { 
            waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
            timeout: 30000
        }).catch(error => {
            console.error('Content loading failed:', error);
            throw error;
        });

        // Wait for content with timeout
        try {
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
        } catch (error) {
            console.error('Content preparation failed:', error);
            throw error;
        }

        // Generate PDF with error handling
        const pdfBuffer = await page.pdf(PDF_OPTIONS).catch(error => {
            console.error('PDF generation failed:', error);
            throw error;
        });

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
        console.error('PDF conversion error:', {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        return NextResponse.json(
            { error: 'Failed to convert HTML to PDF', details: error.message },
            { status: 500 }
        );
    } finally {
        if (browser) {
            await browser.close().catch(error => 
                console.error('Browser cleanup failed:', error)
            );
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
        console.error('HTML extraction failed:', error);
        throw error;
    }
}
