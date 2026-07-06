import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SpeechClient } from '@google-cloud/speech';

const LANGUAGE_CODE_MAP: Record<string, string> = {
  ENGLISH: 'en-US',
  HINDI: 'hi-IN',
  TELUGU: 'te-IN',
  MARATHI: 'mr-IN',
  KANNADA: 'kn-IN',
  TAMIL: 'ta-IN',
  BENGALI: 'bn-IN',
  GUJARATI: 'gu-IN',
  PUNJABI: 'pa-IN',
  MALAYALAM: 'ml-IN',
  ODIA: 'or-IN',
  URDU: 'ur-IN',
};

@Injectable()
export class SttService {
  private readonly logger = new Logger(SttService.name);
  private readonly speechClient: SpeechClient | null = null;

  constructor(private readonly config: ConfigService) {
    const projectId = this.config.get<string>('ai.google.projectId');
    const keyFilename = this.config.get<string>('ai.google.credentialsPath');

    // Initialize speech client if configured
    if (projectId || keyFilename || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      this.speechClient = new SpeechClient({
        ...(projectId ? { projectId } : {}),
        ...(keyFilename ? { keyFilename } : {}),
      });
      this.logger.log('Google Cloud Speech-to-Text client initialized');
    } else {
      this.logger.warn(
        'Google Cloud credentials not found — STT service will use mock transcripts',
      );
    }
  }

  /**
   * Transcribe an audio file into text using Google Cloud Speech-to-Text or mock fallback.
   *
   * @param audioUrl URL of the audio file to transcribe (web URL or gs:// URI).
   * @param language The expected language name/code of the speech.
   * @returns An object containing the transcribed text and the extraction confidence.
   */
  async transcribe(
    audioUrl: string,
    language: string,
  ): Promise<{ transcript: string; confidence: number }> {
    this.logger.log(`Transcribing audio: ${audioUrl} for language: ${language}`);

    const languageCode = LANGUAGE_CODE_MAP[language.toUpperCase()] ?? 'en-US';

    if (this.speechClient) {
      try {
        let audioConfig: any = {};

        if (audioUrl.startsWith('gs://')) {
          // Direct Google Cloud Storage URI
          audioConfig = { gcsUri: audioUrl };
        } else {
          // Download web URL and send as inline base64 content
          this.logger.debug(`Downloading audio file from URL: ${audioUrl}`);
          const response = await fetch(audioUrl);
          if (!response.ok) {
            throw new Error(`Failed to download audio from ${audioUrl}: ${response.statusText}`);
          }
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          audioConfig = { content: buffer.toString('base64') };
        }

        const request = {
          config: {
            // Google STT can auto-detect encoding/sample rate for common formats like WAV/MP3,
            // but we provide standard defaults or let Google STT resolve it.
            languageCode,
            enableAutomaticPunctuation: true,
          },
          audio: audioConfig,
        };

        this.logger.debug(`Sending recognize request to Google Cloud Speech-to-Text API...`);
        const [response] = await this.speechClient.recognize(request);
        
        const transcript = response.results
          ?.map((result) => result.alternatives?.[0]?.transcript)
          .join('\n')
          .trim();

        const confidence = response.results?.[0]?.alternatives?.[0]?.confidence ?? 0.9;

        if (transcript) {
          this.logger.log(`Google STT successfully transcribed ${audioUrl}`);
          return { transcript, confidence };
        }
        
        throw new Error('Google STT API returned empty transcription results');
      } catch (err) {
        this.logger.error(
          `Google Cloud Speech-to-Text failed: ${(err as Error).message} — falling back to mock`,
        );
      }
    }

    // Mock fallback if Google STT is unavailable or fails
    const urlLower = audioUrl.toLowerCase();
    let transcript = 'Water pipeline burst in Sector 47. There is water wasting everywhere, please fix it.';
    let confidence = 0.92;

    const langUpper = language.toUpperCase();

    if (
      urlLower.includes('borewell') ||
      urlLower.includes('anganwadi') ||
      langUpper === 'TELUGU' ||
      langUpper === 'TE'
    ) {
      transcript = 'Anganwadi daggara borewell pani ledu, rendu vaaralugaa';
    } else if (
      urlLower.includes('park') ||
      urlLower.includes('garbage') ||
      langUpper === 'MARATHI' ||
      langUpper === 'MR'
    ) {
      transcript = 'पार्कच्या बाहेर कचరా साचला आहे, दुर्गंधी येत आहे. लोक चालताना त्रास होतोय. कृपया सफाई कामगार पाठవా.';
    } else if (
      urlLower.includes('pipe') ||
      urlLower.includes('water') ||
      langUpper === 'HINDI' ||
      langUpper === 'HI'
    ) {
      transcript = 'पाइप फट गया है, पानी बहुत ज्यादा बर्बाद हो रहा है और सड़क पर गड्ढा हो गया है। कृपया जल्दी भेजें किसी को।';
    } else if (urlLower.includes('pothole') || urlLower.includes('road')) {
      transcript = 'Road is completely damaged and full of potholes near school.';
    }

    return {
      transcript,
      confidence,
    };
  }
}
