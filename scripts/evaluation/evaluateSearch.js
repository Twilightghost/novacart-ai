import connectDB, { mongoose } from '../../server/config/db.js';
import { semanticSearch } from '../../ai-services/retrieval/semanticSearch.js';
import { keywordSearch } from '../../ai-services/retrieval/keywordSearch.js';
import { reciprocalRankFusion } from '../../ai-services/retrieval/rrf.js';
import Product from '../../server/models/Product.js';

// Each test case: a query + the product titles we consider genuinely relevant answers
const testCases = [
  { query: 'comfortable shoes for running', relevantTitles: ['AeroFlex Running Shoes', 'UrbanStep Casual Sneakers'] },
  { query: 'something to keep my drink cold', relevantTitles: ['HydroFlow Steel Water Bottle'] },
  { query: 'laptop for coding', relevantTitles: ['PixelBook Pro 14 Laptop'] },
  { query: 'gift for someone who works from home', relevantTitles: ['ComfortFit Ergonomic Chair', 'StudyDesk Compact Table', 'FocusView 27" Monitor'] },
  { query: 'AeroFlex', relevantTitles: ['AeroFlex Running Shoes'] },
  { query: 'help me sleep better', relevantTitles: ['CozyNight Memory Foam Pillow'] },
  { query: 'workout equipment', relevantTitles: ['YogaFlex Non-Slip Mat'] },
  { query: 'travel accessories', relevantTitles: ['BackPack Pro 30L Travel Bag', 'HydroFlow Steel Water Bottle'] },
];

const precisionAtK = (resultTitles, relevantTitles, k) => {
  const topK = resultTitles.slice(0, k);
  const hits = topK.filter((title) => relevantTitles.includes(title)).length;
  return hits / k;
};

const reciprocalRank = (resultTitles, relevantTitles) => {
  for (let i = 0; i < resultTitles.length; i++) {
    if (relevantTitles.includes(resultTitles[i])) {
      return 1 / (i + 1);
    }
  }
  return 0;
};

const run = async () => {
  await connectDB();

  let keywordTotalPrecision = 0;
  let hybridTotalPrecision = 0;
  let keywordTotalRR = 0;
  let hybridTotalRR = 0;

  console.log('\n=== SEARCH EVALUATION: Keyword-only vs Hybrid ===\n');

  for (const testCase of testCases) {
    const { query, relevantTitles } = testCase;

    // Keyword-only
    let keywordResults = [];
    try {
      keywordResults = await keywordSearch(query, 5);
    } catch {
      keywordResults = [];
    }
    const keywordTitles = keywordResults.map((r) => r.title);
    const keywordP5 = precisionAtK(keywordTitles, relevantTitles, 5);
    const keywordRR = reciprocalRank(keywordTitles, relevantTitles);

    // Hybrid (semantic + keyword + RRF)
    const semanticResults = await semanticSearch(query, 8);
    const relevantSemantic = semanticResults.filter((r) => r.distance <= 0.9);
    const fused = reciprocalRankFusion([relevantSemantic, keywordResults]);
    const fusedIds = fused.slice(0, 5).map((f) => f.productId);
    const fusedProducts = await Product.find({ _id: { $in: fusedIds } }).select('title');
    const hybridTitles = fusedIds.map((id) => fusedProducts.find((p) => p._id.toString() === id)?.title).filter(Boolean);
    const hybridP5 = precisionAtK(hybridTitles, relevantTitles, 5);
    const hybridRR = reciprocalRank(hybridTitles, relevantTitles);

    keywordTotalPrecision += keywordP5;
    hybridTotalPrecision += hybridP5;
    keywordTotalRR += keywordRR;
    hybridTotalRR += hybridRR;

    console.log(`Query: "${query}"`);
    console.log(`  Expected relevant: ${relevantTitles.join(', ')}`);
    console.log(`  Keyword-only P@5: ${keywordP5.toFixed(2)} | Results: ${keywordTitles.join(', ') || '(none)'}`);
    console.log(`  Hybrid P@5:       ${hybridP5.toFixed(2)} | Results: ${hybridTitles.join(', ') || '(none)'}`);
    console.log(`  Keyword RR: ${keywordRR.toFixed(2)} | Hybrid RR: ${hybridRR.toFixed(2)}`);
    console.log('');
  }

  const avgKeyword = keywordTotalPrecision / testCases.length;
  const avgHybrid = hybridTotalPrecision / testCases.length;
  const mrrKeyword = keywordTotalRR / testCases.length;
  const mrrHybrid = hybridTotalRR / testCases.length;

  console.log('=== SUMMARY ===');
  console.log(`Average Precision@5 — Keyword-only: ${avgKeyword.toFixed(3)}`);
  console.log(`Average Precision@5 — Hybrid:       ${avgHybrid.toFixed(3)}`);
  console.log(`Mean Reciprocal Rank — Keyword-only: ${mrrKeyword.toFixed(3)}`);
  console.log(`Mean Reciprocal Rank — Hybrid:       ${mrrHybrid.toFixed(3)}`);

  await mongoose.disconnect();
};

run();