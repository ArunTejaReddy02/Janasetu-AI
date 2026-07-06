import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { SubmissionsService } from '../src/modules/submissions/submissions.service';
import { SubmissionChannel, SubmissionLanguage } from '@prisma/client';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function bootstrap() {
  console.log('🚀 Bootstrapping NestJS application context for testing...');
  const app = await NestFactory.createApplicationContext(AppModule);

  const submissionsService = app.get(SubmissionsService);

  console.log('\n--- 1. Testing Text Submission (Telugu) ---');
  const teluguSubmission = await submissionsService.create({
    channel: SubmissionChannel.WEB,
    text: 'మా వార్డులో డ్రైనేజీ పూర్తిగా బ్లాక్ అయిపోయింది, రోడ్డు మీద నీరు ప్రవహిస్తోంది.',
    language: SubmissionLanguage.TELUGU,
    consent: true,
  });

  console.log(`Created Telugu submission with ID: ${teluguSubmission.id}. Status: ${teluguSubmission.status}`);

  console.log('\n--- 2. Testing Voice Submission (Hindi Mock) ---');
  const voiceSubmission = await submissionsService.create({
    channel: SubmissionChannel.VOICE,
    audioUrl: 'https://storage.googleapis.com/janasetu-audio/pipe_leakage.wav',
    language: SubmissionLanguage.HINDI,
    consent: true,
  });

  console.log(`Created Voice submission with ID: ${voiceSubmission.id}. Status: ${voiceSubmission.status}`);

  console.log('\n⏳ Waiting 8 seconds for BullMQ background workers to process...');
  await sleep(8000);

  console.log('\n--- 3. Verifying Results ---');
  
  const teluguResult = await submissionsService.findOne(teluguSubmission.id);
  console.log('\n[Telugu Submission Results]:');
  console.log(`- Status: ${teluguResult.status}`);
  console.log(`- Raw Text: "${teluguResult.rawText}"`);
  console.log(`- Translated Text: "${teluguResult.translatedText}"`);
  console.log(`- Category: ${teluguResult.category}`);
  console.log(`- Urgency Score: ${teluguResult.urgencyScore}`);
  console.log(`- Location Name: "${teluguResult.locationName}"`);
  console.log(`- Embedding Vector size: ${teluguResult.embedding ? teluguResult.embedding.length : 'none'}`);
  console.log(`- Processing Log:`, teluguResult.processingLog);

  const voiceResult = await submissionsService.findOne(voiceSubmission.id);
  console.log('\n[Voice Submission Results]:');
  console.log(`- Status: ${voiceResult.status}`);
  console.log(`- Raw Text (Transcribed): "${voiceResult.rawText}"`);
  console.log(`- Translated Text: "${voiceResult.translatedText}"`);
  console.log(`- Category: ${voiceResult.category}`);
  console.log(`- Urgency Score: ${voiceResult.urgencyScore}`);
  console.log(`- STT Confidence: ${voiceResult.sttConfidence}`);
  console.log(`- Embedding Vector size: ${voiceResult.embedding ? voiceResult.embedding.length : 'none'}`);
  console.log(`- Processing Log:`, voiceResult.processingLog);

  console.log('\n🛑 Closing application context...');
  await app.close();
  console.log('Done!');
}

bootstrap().catch((err) => {
  console.error('Test pipeline failed:', err);
  process.exit(1);
});
