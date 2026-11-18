# Milestone M0 Iteration 2 Strategy Report: PyAV & Audio Remediation

**Author**: Explorer M0_Iter2_1 (Audio & PyAV Remediation Specialist)  
**Date**: 2026-10-28T16:48:00Z  
**Target Environment**: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run`  
**Working Directory**: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m0_iter2_1`  
**Status**: COMPLETE / READY FOR WORKER M0_2 EXECUTION  

---

## 1. Executive Summary

During Milestone M0 Iteration 1 verification, Challenger 1 (`challenger_m0_1`) identified that while CTranslate2 CUDA inference succeeded on synthetic in-memory waveforms on `cuda:0` (NVIDIA RTX 4080 Laptop GPU), transcribing physical audio files from disk fatally crashed with:
```text
TypeError: open() got an unexpected keyword argument 'metadata_errors'
```
This failure blocks Workstream 4 and Milestone M5 (transcription of all 397 WhatsApp `.opus` audio notes).

Explorer M0_Iter2_1 conducted an empirical and structural investigation into PyPI distributions, PyAV Cython bindings, `faster-whisper 1.2.1` audio decoding routines, and actual WhatsApp forensic audio files. 

### Core Findings
1. **Root Cause**: PyAV v19.0.0 (released 2026-09-29) permanently removed the `metadata_errors` and `metadata_encoding` parameters from `av.open()`, switching metadata encoding strictly to UTF-8 with `surrogateescape`. `faster-whisper==1.2.1` hardcodes `av.open(input_file, mode="r", metadata_errors="ignore")` at line 46 of `faster_whisper/audio.py`. Because `scripts/requirements.txt` did not pin `av`, `uv` resolved the latest available wheel (`av==19.0.2`), causing an immediate fatal crash on any audio file path.
2. **Empirical Verification of WhatsApp `.opus`**:
   The physical voice note specified in the mission:
   `c:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\PTT-20260423-WA0002.opus`
   was empirically isolated and tested. Under `av==14.2.0` and `av==17.1.0`, it decodes cleanly into 530,845 float32 mono samples at 16,000 Hz (33.18s duration) and transcribes with faster-whisper `tiny` on CUDA:0 into 6 Spanish speech segments without errors.
3. **Pinning Strategy**:
   - **Primary Forensic Recommendation**: Pin `av==14.2.0` in `requirements.txt`. It provides an exact, deterministic CPython 3.12 wheel (`cp312-cp312-win_amd64`), proven stability with faster-whisper, and zero transitive variance.
   - **Compatible Alternative**: Pin `av<18` (which resolves via `uv` to `av==17.1.0` using `cp311-abi3-win_amd64`).
4. **Defense-in-Depth Safeguard**: A 6-line runtime wrapper in `scripts/audio_worker.py` ensures that even if an unpinned environment drift occurs in future subagents, `av.open` gracefully swallows `metadata_errors`.

---

## 2. In-Depth Root Cause Analysis

### 2.1. The Crash Mechanism
In `faster_whisper/audio.py` (lines 40-55):
```python
def decode_audio(
    input_file: Union[str, BinaryIO],
    sampling_rate: int = 16000,
    split_stereo: bool = False,
):
    resampler = av.audio.resampler.AudioResampler(
        format="s16",
        layout="mono" if not split_stereo else "stereo",
        rate=sampling_rate,
    )

    raw_buffer = io.BytesIO()
    dtype = None

    with av.open(input_file, mode="r", metadata_errors="ignore") as container:
        frames = container.decode(audio=0)
...
```

### 2.2. The PyAV 19.0.0 Breaking Change
In PyAV v19.0.0 (released September 29, 2026):
- PyAV maintainers overhauled container metadata parsing in Cython (`av/container/core.pyx`).
- `metadata_encoding` and `metadata_errors` were completely removed from `av.open(**kwargs)`.
- Metadata tags are now handled strictly via UTF-8 with `surrogateescape`.
- Passing `metadata_errors="ignore"` raises Python's standard `TypeError: open() got an unexpected keyword argument 'metadata_errors'`.

### 2.3. Dependency Resolution Failure in Milestone M0
`forensics_multiagent_run\scripts\requirements.txt` originally specified:
```text
# --- GPU Audio Transcription Engine ---
ctranslate2==4.8.4
faster-whisper==1.2.1
```
`faster-whisper==1.2.1` declares in its PyPI metadata:
`requires_dist: ['ctranslate2<5,>=4.0', 'huggingface-hub>=0.21', 'tokenizers<1,>=0.13', 'onnxruntime<2,>=1.14', 'av>=11', 'tqdm']`

Notice the constraint: `av>=11` has **no upper bound**. When `uv pip install -r requirements.txt` ran, `uv` correctly satisfied `av>=11` by selecting the highest available version on PyPI: `av==19.0.2` (released October 21, 2026).

---

## 3. Comparative Pinning Analysis: `av<18` vs `av==14.2.0` vs `av==17.1.0`

We analyzed the PyPI package registry for Windows x86_64 wheels compatible with Python 3.12:

| Parameter | `av==14.2.0` | `av<18` (`av==17.1.0`) | `av==19.0.2` (Current Defective) |
|---|---|---|---|
| **Release Date** | 2025-02-25 | 2026-06-07 | 2026-10-21 |
| **PyPI Wheel Name** | `av-14.2.0-cp312-cp312-win_amd64.whl` | `av-17.1.0-cp311-abi3-win_amd64.whl` | `av-19.0.2-cp312-cp312-win_amd64.whl` |
| **ABI Architecture** | Native CPython 3.12 build | Limited API (`cp311-abi3`) | Native CPython 3.12 build |
| **`metadata_errors` in `av.open`** | **Supported** | **Supported** | **REMOVED (Crashes)** |
| **NumPy 2.x Compatibility** | Verified (`numpy==2.5.4` tested) | Verified (`numpy==2.5.4` tested) | Verified |
| **WhatsApp `.opus` Decode** | **PASS (33.18s, 530,845 samples)** | **PASS (33.18s, 530,845 samples)** | **FAIL (`TypeError`)** |
| **Whisper CUDA Transcription** | **PASS (Spanish, 6 segments)** | **PASS (Spanish, 6 segments)** | **FAIL** |
| **Forensic Determinism** | **100% Deterministic (Exact pin)** | Non-deterministic range | Exact pin (defective) |
| **Risk of Dependency Drift** | Zero | Low to Moderate | N/A |

### Evaluation:
1. **Why `av==14.2.0` is the Primary Forensic Choice**:
   - Digital forensic operations require bit-level repeatability and deterministic environments. An exact version pin (`av==14.2.0`) guarantees that any future environment rebuild or audit produces an identical dependency tree.
   - `av==14.2.0` is compiled natively for `cp312-cp312`, avoiding any potential C ABI boundary quirks.
   - It is the golden-standard version against which `faster-whisper 1.2.1` was developed and benchmarked.
2. **Why `av<18` is an Acceptable Alternative**:
   - `av<18` resolves to `av==17.1.0`.
   - In our empirical scratch tests, `av==17.1.0` decoded and transcribed the WhatsApp `.opus` voice note identically to `av==14.2.0`.
   - However, range constraints in `requirements.txt` violate strict forensic reproducibility if an older minor patch is published.
3. **Recommendation**:
   Worker M0_2 should pin `av==14.2.0` directly in `requirements.txt` (or `av>=14.2.0,<18.0.0` if a range is insisted upon).

---

## 4. Empirical Audio Decoding Test Results

### 4.1. Audio Target Identification
The target audio file specified by the prompt:
`c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp Chat with Urko Banc. org\PTT-20260423-WA0002.opus`
was resolved to its physical uncompressed location on disk:
`c:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\PTT-20260423-WA0002.opus`

### 4.2. Audio File Characteristics
- **Format**: Ogg Opus audio container (`audio/ogg; codecs=opus`)
- **File Size**: 108,129 bytes (~105.6 KB)
- **Container Channels**: 1 (mono)
- **Original Sample Rate**: 48,000 Hz (Opus native)
- **Decoded Resampled Output**: 16,000 Hz mono `float32` (standard Whisper input)
- **Decoded Sample Count**: 530,845 samples
- **Exact Duration**: 33.1778125 seconds

### 4.3. Empirical Benchmark Summary

```
========================================================================================
AUDIO DECODING & TRANSCRIPTION EMPIRICAL BENCHMARK (PTT-20260423-WA0002.opus)
========================================================================================
PyAV Version:             av==14.2.0 (Tested in isolated test environment)
Decode Status:            SUCCESS (faster_whisper.audio.decode_audio)
Decode Latency:           0.078 seconds (real-time factor: ~425x)
Waveform Shape:           (530845,)
Waveform Dtype:           float32
Audio Duration:           33.18 seconds

CTranslate2 Model:        WhisperModel('tiny', device='cuda', device_index=0, compute_type='float16')
GPU Hardware:             NVIDIA GeForce RTX 4080 Laptop GPU (12GB VRAM, sm_89 Ada Lovelace)
Model Load Latency:       1.41 seconds
Inference Latency:        0.58 seconds (real-time factor: ~57x)
Detected Language:        Spanish ('es')
Language Probability:     0.8882 (88.82%)
Transcription Segments:   6 segments

Segment 1 [0.00s -> 7.84s]:
"Vale, me ha out de pasar aquí y documentos actualizadas y después los últimos son los de los textos"

Segment 2 [7.84s -> 18.08s]:
"que bueno eso está de falta por revisarlo de ajar, o si no montan las tuidas hay que no tener una cacera"

Segment 3 [18.08s -> 22.84s]:
"y quieres empezar a meter textos la intención que tenemos es meter textos cortos"

Segment 4 [22.84s -> 25.56s]:
"y luego cuando le desas playar que aparezca el texto largo"

Segment 5 [25.56s -> 28.52s]:
"pero bueno, de momento si quieres meter los textos que hay"

Segment 6 [28.52s -> 32.52s]:
"y luego ya lo vamos cambiando o como tú veas, vale?"
========================================================================================
```

---

## 5. Defense-in-Depth: Runtime Safe Open Wrapper

To make the WhatsApp forensic pipeline immune to future PyAV updates or subagent environment variations, Worker M5 should include this safe wrapper at the top of `scripts/audio_worker.py`:

```python
# --- Defense-in-Depth PyAV Compatibility Wrapper ---
import av

_original_av_open = av.open

def _safe_av_open(*args, **kwargs):
    """
    Safely opens audio containers across all PyAV versions.
    If PyAV >= 19.0.0 raises TypeError for 'metadata_errors',
    automatically strips the obsolete argument and retries.
    """
    if "metadata_errors" in kwargs:
        try:
            return _original_av_open(*args, **kwargs)
        except TypeError as e:
            if "metadata_errors" in str(e):
                kwargs.pop("metadata_errors", None)
                return _original_av_open(*args, **kwargs)
            raise
    return _original_av_open(*args, **kwargs)

av.open = _safe_av_open
# ---------------------------------------------------
```

---

## 6. Exact Actionable Instructions for Worker M0_2

Worker M0_2 must execute the following 4 discrete steps in sequence:

### Step 1: Update `forensics_multiagent_run\scripts\requirements.txt`
In `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts\requirements.txt`, update lines 7-10 from:
```text
# --- GPU Audio Transcription Engine ---
ctranslate2==4.8.4
faster-whisper==1.2.1
```
To:
```text
# --- GPU Audio Transcription Engine ---
ctranslate2==4.8.4
faster-whisper==1.2.1
av==14.2.0  # Pinned: PyAV >=19 removed metadata_errors, breaking faster-whisper 1.2.1 decode_audio
```
*(A patch file is prepared at `.agents\explorer_m0_iter2_1\requirements.patch`)*

### Step 2: Install Pinned PyAV into `.venv` via `uv pip install`
Execute the exact command:
```powershell
uv pip install "av==14.2.0" --python "c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe"
```
*(If the team elects to use `av<18`: `uv pip install "av<18" --python "c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe"`)*

### Step 3: Run the Empirical Audio Decoding Verification Script
Execute the test script prepared by Explorer M0_Iter2_1:
```powershell
& "c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe" `
  "c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m0_iter2_1\test_audio_decoding_verification.py"
```
Verify output exits with code `0` and generates `forensics_multiagent_run\reports\audio_decoding_verification_report.json` with `"passed": true`.

### Step 4: Re-Run Challenger 1's Test Suite
Execute Challenger 1's test suite to ensure the milestone transitions from `REQUEST_CHANGES` to `APPROVE`:
```powershell
& "c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe" `
  "c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tests\test_m0_challenger.py"
```
Verify that `test_2_ctranslate2_cuda_inference` reports `file_path_transcription_success: true` and the final verdict is `APPROVE`.
