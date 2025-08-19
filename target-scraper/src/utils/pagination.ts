import { Page } from 'playwright';

export async function paginateUntilDone(
    page: Page,
    extractFn: () => Promise<string[]>,
    nextButtonSelector: string,
    maxPages = 3
): Promise<string[]> {
    let allUrls: string[] = [];
    let currentPage = 1;

    while (currentPage <= maxPages) {
        console.log(`📄 Page ${currentPage}/${maxPages}`);
        const urls = await extractFn();
        allUrls.push(...urls);

        const nextButton = await page.$(nextButtonSelector);
        if (!nextButton) {
            console.log('🚪 No next page button, stopping');
            break;
        }

        try {
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }),
                nextButton.click(),
            ]);
        } catch {
            console.log(`⚠️ Failed to navigate to page ${currentPage + 1}`);
            break;
        }

        currentPage++;
        await page.waitForTimeout(1500); // let content settle
    }

    // Deduplicate results
    return [...new Set(allUrls)];
}
