import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: Request) {
    try {
        const { html, filename = 'document.pdf' } = await request.json();

        if (!html) {
            return NextResponse.json(
                { error: 'HTML content is required' },
                { status: 400 }
            );
        }

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Add support for both direct HTML and URL
        if (html.startsWith('http')) {
            await page.goto(html, { waitUntil: 'networkidle0' });
        } else {
            await page.setContent(html, { waitUntil: 'networkidle0' });
        }

        const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            },
            printBackground: true
        });

        await browser.close();

        // Return the PDF as a response
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=${filename}`
            }
        });

    } catch (error) {
        console.error('PDF conversion error:', error);
        return NextResponse.json(
            { error: 'Failed to convert HTML to PDF' },
            { status: 500 }
        );
    }
}