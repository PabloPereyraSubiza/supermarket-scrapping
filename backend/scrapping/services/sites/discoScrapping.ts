import puppeteer from 'puppeteer';
import { Page } from 'puppeteer';

interface Product {
  name: string;
  price: string;
  link: string;
  imageUrl?: string;
}

const scrapeFirstSite = async (): Promise<Product[]> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const url = 'https://www.disco.com.uy/ferias?sc=1';
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.setViewport({width: 1514, height: 1024});
    await page.waitForSelector('div[aria-roledescription="slide"]');

    const totalSlides = await page.evaluate(() => {
      const totalSlides = document.querySelectorAll('div[aria-roledescription="slide"]').length;
      return totalSlides;
    });

    const totalProducts: Product[] = [];
    const iterations = Math.ceil(totalSlides / 5);

    for (let i = 0; i < iterations; i++) {
      await page.waitForSelector('div[aria-roledescription="slide"]');
      totalProducts.push(...await evaluateProducts(page));
      await page.click('button[aria-label="Next Slide"]');
    }
    const uniqueProducts = removeDuplicates(totalProducts);
    return uniqueProducts;
  } catch (error) {
    console.error('Error scraping first site:', error);
    return [];
  } finally {
    await browser.close();
  }
};

const evaluateProducts = async (page: Page) => {
  const products = await page.evaluate(() => {
    const productElements = document.querySelectorAll('div[aria-roledescription="slide"]');
    const products: Product[] = [];

    productElements.forEach((element) => {
      const name = element.querySelector('span.vtex-product-summary-2-x-productBrand')?.textContent?.trim();
      const price = element.querySelector('span.devotouy-products-components-0-x-sellingPriceWithUnitMultiplier')?.textContent?.trim();
      const link = element.querySelector('a.vtex-product-summary-2-x-clearLink')?.getAttribute('href')?.trim();
      const imageUrl = element.querySelector('img.vtex-product-summary-2-x-image')?.getAttribute('src')?.trim();

      if (name && price && link) {
        products.push({
          name,
          price,
          link: `https://www.disco.com.uy${link}`,
          imageUrl,
        });
      }
    });

    return products;
  });

  return products;
};

const removeDuplicates = (products: Product[]) => {
  const uniqueProducts: Product[] = [];
  const productNames = new Set<string>();

  products.forEach((product) => {
    if (!productNames.has(product.name)) {
      uniqueProducts.push(product);
      productNames.add(product.name);
    }
  });

  return uniqueProducts;
};

export default scrapeFirstSite;
