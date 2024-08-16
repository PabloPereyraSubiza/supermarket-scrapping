import scrapeDisco from './services/sites/discoScrapping';

const main = async () => {
  const products = await scrapeDisco();
  console.log('Scraped products:', products);
};

main();
