

const axios = require("axios");
const cheerio = require("cheerio");
const readline = require("readline");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

// ── SCRAPE FUNCTION
async function scrapeWebsite(url) {
  try {
    console.log(`\n🌐 Fetching: ${url}`);
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0 Safari/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    // Extract useful data
    const title = $("title").text().trim();
    const metaDesc = $('meta[name="description"]').attr("content") || "N/A";
    const h1s = [];
    const links = [];
    const images = [];
    const paragraphs = [];

    $("h1").each((_, el) => {
      const text = $(el).text().trim();
      if (text) h1s.push(text);
    });

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      const text = $(el).text().trim();
      if (href && href.startsWith("http") && text) {
        links.push({ text: text.slice(0, 50), href });
      }
    });

    $("img[src]").each((_, el) => {
      const src = $(el).attr("src");
      const alt = $(el).attr("alt") || "No alt text";
      if (src) images.push({ src: src.slice(0, 60), alt: alt.slice(0, 40) });
    });

    $("p").each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 40) paragraphs.push(text.slice(0, 120) + "...");
    });

    // ── DISPLAY RESULTS
    console.log("\n" + "=".repeat(50));
    console.log("🔍 SCRAPE RESULTS");
    console.log("=".repeat(50));

    console.log(`\n📌 Page Title:\n   ${title}`);
    console.log(`\n📋 Meta Description:\n   ${metaDesc}`);

    if (h1s.length > 0) {
      console.log(`\n🏷️  Headings (H1):`);
      h1s.slice(0, 5).forEach((h) => console.log(`   • ${h}`));
    }

    if (paragraphs.length > 0) {
      console.log(`\n📝 Sample Content:`);
      paragraphs.slice(0, 3).forEach((p, i) => console.log(`   ${i + 1}. ${p}`));
    }

    if (links.length > 0) {
      console.log(`\n🔗 External Links Found: ${links.length}`);
      links.slice(0, 5).forEach((l) => console.log(`   • ${l.text} → ${l.href}`));
    }

    if (images.length > 0) {
      console.log(`\n🖼️  Images Found: ${images.length}`);
      images.slice(0, 4).forEach((img) => console.log(`   • [${img.alt}] ${img.src}`));
    }

    console.log("\n" + "=".repeat(50));
    console.log(`✅ Scraping complete! Found:`);
    console.log(`   H1 Tags: ${h1s.length} | Links: ${links.length} | Images: ${images.length} | Paragraphs: ${paragraphs.length}`);
    console.log("=".repeat(50));
  } catch (err) {
    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
      console.log("❌ Cannot reach the website. Check the URL or internet.");
    } else if (err.response) {
      console.log(`❌ Server returned status: ${err.response.status}`);
    } else if (err.code === "ETIMEDOUT") {
      console.log("❌ Request timed out. Try a different URL.");
    } else {
      console.log(`❌ Error: ${err.message}`);
    }
  }
}

// ── MAIN
async function main() {
  console.log("====================================");
  console.log("     INTERACTIVE WEB SCRAPER        ");
  console.log("====================================");
  console.log("Scrapes: Title, Meta, Headings, Links, Images, Content");

  while (true) {
    const url = await ask("\n🌐 Enter URL to scrape (or 'exit'): ");
    if (url.toLowerCase() === "exit") {
      console.log("\n👋 Goodbye!");
      rl.close();
      break;
    }
    if (!url.startsWith("http")) {
      console.log("❌ URL must start with http:// or https://");
      continue;
    }
    await scrapeWebsite(url.trim());
  }
}

main();
