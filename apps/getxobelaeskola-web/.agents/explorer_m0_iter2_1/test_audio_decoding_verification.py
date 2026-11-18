"""
test_audio_decoding_verification.py - Empirical Audio Decoding Verification
Milestone M0 Iteration 2: WhatsApp Digital Forensic Multi-Agent Operation
Explorer: Explorer M0_Iter2_1 (Audio & PyAV Remediation Specialist)

Purpose:
Empirically verify that faster-whisper 1.2.1 and PyAV correctly decode and transcribe
real WhatsApp .opus voice notes on Windows x86_64 without 'metadata_errors' crashes.

Target Audio:
PTT-20260423-WA0002.opus (WhatsApp voice note, 33.18 seconds, Ogg Opus)
"""

import os
import sys
import time
import json
from pathlib import Path
import numpy as np

# Bind CUDA DLLs if available
SCRIPTS_DIR = Path(r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts")
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

try:
    import cuda_init
    cuda_init.init_cuda_dlls()
except Exception as e:
    print(f"[WARN] cuda_init skipped or failed: {e}")

# Resolve audio file location
AUDIO_CANDIDATE_PATHS = [
    Path(r"c:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\PTT-20260423-WA0002.opus"),
    Path(r"c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp Chat with Urko Banc. org\PTT-20260423-WA0002.opus"),
    Path(r"c:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\PTT-20210304-WA0001.opus"),
]


def find_sample_audio() -> Path:
    for p in AUDIO_CANDIDATE_PATHS:
        if p.exists():
            return p
    raise FileNotFoundError(f"None of the candidate audio files exist: {AUDIO_CANDIDATE_PATHS}")


def run_verification():
    report = {
        "timestamp_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "test_name": "test_audio_decoding_verification",
        "passed": False,
        "details": {}
    }

    # 1. Verify PyAV version and environment
    import av
    report["details"]["av_version"] = getattr(av, "__version__", "unknown")
    print(f"[*] Detected PyAV version: {report['details']['av_version']}")

    # 2. Locate target audio
    audio_path = find_sample_audio()
    report["details"]["audio_path"] = str(audio_path)
    report["details"]["file_size_bytes"] = audio_path.stat().st_size
    print(f"[*] Testing audio file: {audio_path.name} ({report['details']['file_size_bytes']} bytes)")

    # 3. Direct decode_audio test (faster_whisper.audio.decode_audio)
    import faster_whisper.audio
    t0 = time.time()
    try:
        waveform = faster_whisper.audio.decode_audio(str(audio_path), sampling_rate=16000)
        decode_duration = round(time.time() - t0, 4)
        audio_duration_sec = round(len(waveform) / 16000.0, 4)

        report["details"]["decode_success"] = True
        report["details"]["decode_duration_sec"] = decode_duration
        report["details"]["audio_samples"] = len(waveform)
        report["details"]["audio_duration_sec"] = audio_duration_sec
        report["details"]["waveform_dtype"] = str(waveform.dtype)
        report["details"]["waveform_shape"] = list(waveform.shape)

        assert isinstance(waveform, np.ndarray), "Decoded audio must be a numpy ndarray"
        assert waveform.dtype == np.float32, f"Expected float32 waveform, got {waveform.dtype}"
        assert len(waveform) > 0, "Decoded waveform must have >0 samples"
        assert audio_duration_sec > 5.0, f"Expected duration > 5s, got {audio_duration_sec}s"
        print(f"[+] decode_audio() succeeded in {decode_duration}s: {len(waveform)} samples, {audio_duration_sec}s duration")
    except Exception as e:
        report["details"]["decode_success"] = False
        report["details"]["decode_error"] = f"{type(e).__name__}: {e}"
        print(f"[-] decode_audio() failed: {type(e).__name__}: {e}")
        return report

    # 4. Transcribe test using WhisperModel on cuda:0
    from faster_whisper import WhisperModel
    t1 = time.time()
    try:
        model = WhisperModel("tiny", device="cuda", device_index=0, compute_type="float16")
        load_time = round(time.time() - t1, 3)
        report["details"]["model_load_time_sec"] = load_time

        t2 = time.time()
        segments, info = model.transcribe(str(audio_path), beam_size=1)
        seg_list = list(segments)
        transcribe_time = round(time.time() - t2, 3)

        transcript_text = " ".join([s.text for s in seg_list]).strip()
        report["details"]["transcribe_success"] = True
        report["details"]["transcribe_duration_sec"] = transcribe_time
        report["details"]["detected_language"] = info.language
        report["details"]["language_probability"] = round(info.language_probability, 4)
        report["details"]["segment_count"] = len(seg_list)
        report["details"]["transcript_preview"] = transcript_text[:160] + "..." if len(transcript_text) > 160 else transcript_text

        assert len(seg_list) > 0, "Must return at least 1 transcription segment"
        assert len(transcript_text) > 10, "Transcript must contain meaningful text"
        print(f"[+] WhisperModel transcribe() succeeded on cuda:0 in {transcribe_time}s:")
        print(f"    Language: {info.language} (prob: {report['details']['language_probability']})")
        print(f"    Segments: {len(seg_list)}")
        print(f"    Preview:  {report['details']['transcript_preview']}")

        report["passed"] = True
    except Exception as e:
        report["details"]["transcribe_success"] = False
        report["details"]["transcribe_error"] = f"{type(e).__name__}: {e}"
        print(f"[-] WhisperModel transcribe() failed: {type(e).__name__}: {e}")

    return report


if __name__ == "__main__":
    res = run_verification()
    output_dir = Path(r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\reports")
    output_dir.mkdir(parents=True, exist_ok=True)
    out_file = output_dir / "audio_decoding_verification_report.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(res, f, indent=2)
    print(f"\nReport written to: {out_file}")
    sys.exit(0 if res["passed"] else 1)
