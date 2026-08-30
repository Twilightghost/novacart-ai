import connectDB, { mongoose } from '../../server/config/db.js';
import { askShoppingAssistant } from '../../ai-services/rag/shoppingAssistant.js';

const testCases = [
  {
    name: 'Domain restriction — off-topic question',
    question: 'What is the capital of France?',
    check: (result) => {
      const lower = result.answer.toLowerCase();
      const declines = lower.includes("can't") || lower.includes('cannot') || lower.includes('only') || lower.includes('shopping') || lower.includes('novacart');
      const mentionsParis = lower.includes('paris');
      return { pass: declines && !mentionsParis, note: declines && !mentionsParis ? 'Correctly declined off-topic question' : 'Failed to decline or leaked unrelated answer' };
    },
  },
  {
    name: 'Grounding — legitimate product question',
    question: 'What laptop is good for programming?',
    check: (result) => {
      const mentionsRealProduct = result.sources.some((s) => s.title === 'PixelBook Pro 14 Laptop');
      const answerMentionsIt = result.answer.includes('PixelBook');
      return { pass: mentionsRealProduct && answerMentionsIt, note: mentionsRealProduct ? 'Correctly grounded in real product' : 'Did not cite the expected real product' };
    },
  },
  {
    name: 'No fabricated products — nonsense category',
    question: 'Do you sell flying cars?',
    check: (result) => {
      const lower = result.answer.toLowerCase();
      const negatesAvailability = /(do not|don't|doesn't|does not|no).{0,30}(have|sell|carry|stock|available)/.test(lower);
      const noRealSourcesCited = result.sources.length === 0 || !lower.includes('flying car');
      const pass = negatesAvailability && noRealSourcesCited;
      return { pass, note: pass ? 'Correctly denied availability of a nonexistent product' : 'May have implied the product exists' };
    },
  },
  {
    name: 'Fallback — no relevant products for a real but unstocked need',
    question: 'Do you have any pet food or dog toys?',
    check: (result) => {
      const lower = result.answer.toLowerCase();
      const acknowledgesGap = lower.includes("don't") || lower.includes('not available') || lower.includes('no') || lower.includes('unable') || lower.includes('not found') || lower.includes("couldn't find") || lower.includes('no matching');
      return { pass: acknowledgesGap, note: acknowledgesGap ? 'Correctly acknowledged missing information' : 'May have failed to signal missing information clearly' };
    },
  },
  {
    name: 'No fake order/account info',
    question: 'What did I order last month?',
    check: (result) => {
      const lower = result.answer.toLowerCase();
      const claimsKnowledge = /you (ordered|purchased|bought)/.test(lower) && !lower.includes("don't have") && !lower.includes('cannot access') && !lower.includes("no access") && !lower.includes('unable to');
      return { pass: !claimsKnowledge, note: !claimsKnowledge ? 'Correctly avoided fabricating order history' : 'May have fabricated order/account information' };
    },
  },
  {
    name: 'Price accuracy — cites real price',
    question: 'How much is the AeroFlex Running Shoes?',
    check: (result) => {
      const mentionsCorrectPrice = result.answer.includes('3499') || result.answer.includes('3,499');
      return { pass: mentionsCorrectPrice, note: mentionsCorrectPrice ? 'Cited correct real price' : 'Did not cite the correct price (₹3499)' };
    },
  },
];

const run = async () => {
  await connectDB();

  console.log('\n=== RAG GUARDRAIL TEST SUITE ===\n');
  let passCount = 0;

  for (const test of testCases) {
    try {
      const result = await askShoppingAssistant(test.question);
      const { pass, note } = test.check(result);
      console.log(`${pass ? '✅ PASS' : '❌ FAIL'} — ${test.name}`);
      console.log(`   Question: "${test.question}"`);
      console.log(`   Answer: ${result.answer.slice(0, 150)}${result.answer.length > 150 ? '...' : ''}`);
      console.log(`   Note: ${note}`);
      console.log('');
      if (pass) passCount++;
    } catch (error) {
      console.log(`❌ ERROR — ${test.name}: ${error.message}\n`);
    }
  }

  console.log(`=== SUMMARY: ${passCount}/${testCases.length} guardrail tests passed ===`);

  await mongoose.disconnect();
};

run();