# Milestone M0 Empirical Challenge & Verification Report

**Author**: Challenger 1 (`challenger_m0_1` — Critic, Specialist)  
**Date**: 2026-10-28T16:36:00Z  
**Target Environment**: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run`  
**Verdict**: **`REQUEST_CHANGES`**  
**Associated Artifacts**: `forensics_multiagent_run\tests\test_m0_challenger.py`, `forensics_multiagent_run\reports\challenger_m0_empirical_report.json`

---

## 1. Observation

All observations were captured by direct test execution of `forensics_multiagent_run\tests\test_m0_challenger.py` via Python executable `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe`.

### 1.1. Zero-PyTorch Footprint (Assertion 1) — PASS
- `import torch` raises `ModuleNotFoundError: No module named 'torch'`.
- `import torchvision` and `import torchaudio` both raise `ModuleNotFoundError`.
- Enumeration of installed distributions via `importlib.metadata.distributions()` returned 0 distributions containing `torch`.
- Observation verbatim:
  ```json
  "test_1_zero_pytorch": {
    "torch_import": "PASSED (ModuleNotFoundError raised)",
    "torchvision_import": "PASSED (ModuleNotFoundError raised)",
    "torchaudio_import": "PASSED (ModuleNotFoundError raised)",
    "torch_distributions_found": [],
    "dist_check": "PASSED (0 torch distributions found)",
    "passed": true
  }
  ```

### 1.2. CTranslate2 CUDA Inference & Audio Decoding (Assertion 2) — PARTIAL / DEFECT DETECTED
- `ctranslate2.get_cuda_device_count()` returned `1`.
- Device identified: `NVIDIA GeForce RTX 4080 Laptop GPU` (sm_89 Ada Lovelace, 12,282 MiB VRAM).
- Supported compute types on `cuda:0`: `['int8_bfloat16', 'float16', 'int8', 'bfloat16', 'int8_float32', 'int8_float16', 'float32']`.
- WhisperModel tiny instantiation on `cuda:0` with `float16` succeeded in `1.498s`.
- Synthetic in-memory 16kHz sine waveform forward CUDA pass succeeded in `0.329s`.
- **CRITICAL DEFECT OBSERVED**: When attempting to transcribe a physical audio file from the corpus (`c:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\PTT-20210304-WA0001.opus`) or any `.wav` audio file path, execution failed fatally:
  ```
  TypeError: open() got an unexpected keyword argument 'metadata_errors'
  ```
  Traceback location:
  `faster_whisper\audio.py`, line 46, in `decode_audio`:
  ```python
  with av.open(input_file, mode="r", metadata_errors="ignore") as container:
  ```
  Environment audit revealed `av==19.0.2` installed in `.venv`. PyAV version 18+ removed the `metadata_errors` argument from `av.open()`, rendering `faster-whisper==1.2.1` unable to load any audio file path from disk.

### 1.3. Tesseract OCR Spanish and Basque Recognition (Assertion 3) — PASS
- Tesseract binary deployed at `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tools\tesseract\tesseract.exe`.
- Models present in `tessdata\`: `['eng', 'eus', 'osd', 'spa']`.
- Spanish sample image OCR output:
  `"CLUB GETXO BELA ESKOLA - RECIBO DE CUOTAS DE SOCIO 2026\nMatricula federativa abonada: 150,00 EUR"` (`spa_recognized: true`).
- Basque sample image OCR output:
  `"GETXO BELA ESKOLA BAZKIDEEN ORDAINKETA AGIRIA"` (`eus_recognized: true`).
- Combined `spa+eus` OCR correctly extracted bilingual header tokens.

### 1.4. SQLite Baseline Read-Only Enforcement (Assertion 4) — PASS
- Baseline database: `c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db`.
- Pre-test SHA-256: `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3` (exact match to project baseline).
- WAL file size: `0` bytes.
- Census verified: `10,055` messages, `392` contacts.
- Adversarial write attempts executed under URI `file:///<path>?mode=ro`:
  1. `CREATE TABLE _malicious_table (id INT);` -> `sqlite3.OperationalError: attempt to write a readonly database`
  2. `DROP TABLE contacts;` -> `sqlite3.OperationalError: attempt to write a readonly database`
  3. `PRAGMA user_version = 777;` -> `sqlite3.OperationalError: attempt to write a readonly database`
- All write mutations 100% blocked; unblocked operations: `0`.
- Post-test SHA-256: `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3` (100% bit-level preserved).

### 1.5. Concurrent Inserts to `run_evidence.db` under WAL Mode (Assertion 5) — PASS
- Database: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db`.
- Verified `PRAGMA journal_mode`: `WAL`.
- Stress test harness spawned `16` concurrent worker threads, each performing `50` distinct insert transactions into `file_inventory` (`800` total records) using `PRAGMA busy_timeout = 60000; PRAGMA synchronous = NORMAL;`.
- Results:
  - Total expected records: `800`
  - Total inserted records: `800`
  - Lock errors / collisions: `0` (`lock_errors_count: 0`)
  - Average worker transaction duration: `0.138s`
  - Post-stress `PRAGMA integrity_check`: `[('ok',)]`

---

## 2. Logic Chain

1. **Assertion 1 (Zero-PyTorch)**: The empirical absence of `torch`, `torchvision`, and `torchaudio` modules, combined with zero PyPI metadata distributions containing "torch" in `.venv`, proves that Worker M0 adhered strictly to Rule 1 lean dependency requirements without PyTorch bloat (Observation 1.1).
2. **Assertion 2 (CTranslate2 CUDA vs. PyAV File Decoding Breakage)**:
   - While CTranslate2 CUDA inference executes properly on `cuda:0` when fed an in-memory numpy array, audio workers in Milestone M5 must transcribe physical files (397 `.opus` files).
   - In `requirements.txt`, the dependency `av` was not pinned. When `uv` resolved dependencies for `faster-whisper==1.2.1`, it pulled the latest PyAV release (`av==19.0.2`).
   - PyAV 18+ removed the parameter `metadata_errors` from `av.open()`. Because `faster-whisper==1.2.1` explicitly invokes `av.open(..., metadata_errors="ignore")`, any invocation of `model.transcribe("file.opus")` throws `TypeError: open() got an unexpected keyword argument 'metadata_errors'` (Observation 1.2).
   - Therefore, while CUDA compute is functional, the audio transcription pipeline is crippled for file inputs until `av<18` (e.g. `av==17.1.0`) is pinned.
3. **Assertion 3 (Tesseract spa+eus OCR)**: Tesseract 5.5.0 and `tessdata` linguistic models (`spa.traineddata`, `eus.traineddata`) accurately recognize Spanish banking/membership terms ("GETXO BELA ESKOLA", "CUOTAS", "MATRICULA") and Basque terms ("BAZKIDEEN ORDAINKETA AGIRIA"). This confirms that Worker M4's fallback pipeline is operational (Observation 1.3).
4. **Assertion 4 (SQLite Read-Only Baseline)**: Connecting with `?mode=ro` strictly prohibits all DDL, DML, and PRAGMA mutations. The post-attack SHA-256 hash remained bit-identical to the pre-test hash (`030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3`), guaranteeing chain-of-custody defensibility (Observation 1.4).
5. **Assertion 5 (WAL Concurrency)**: 16 concurrent threads inserting 800 rows completed with 0 lock collisions and 0 timeouts under `busy_timeout=60000` and `synchronous=NORMAL`. Subsequent database integrity check returned `ok`, proving that `run_evidence.db` can safely support parallel multi-agent write operations (Observation 1.5).

---

## 3. Caveats

- **Scope of Review**: Review was conducted strictly in accordance with Review-Only constraints. No production code or dependencies were altered by Challenger 1.
- **In-Memory Audio vs. File Decoding**: Downstream workers passing pre-decoded numpy arrays to `WhisperModel.transcribe()` would not experience the `av` crash, but standard `faster-whisper` usage involves passing file paths, which directly triggers the `decode_audio` crash.

---

## 4. Conclusion

**Verdict: REQUEST_CHANGES**

Milestone M0 is 90% sound and satisfies Assertions 1, 3, 4, 5, and in-memory CUDA compute for Assertion 2.
However, **Milestone M0 cannot be approved unconditionally** because of a critical dependency incompatibility in `.venv`:
- **Finding**: `faster-whisper==1.2.1` fails to decode audio files from disk due to `av==19.0.2` (`TypeError: open() got an unexpected keyword argument 'metadata_errors'`).
- **Required Change**:
  1. Update `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts\requirements.txt` to add:
     ```text
     av<18  # Required for faster-whisper 1.2.1 decode_audio compatibility
     ```
  2. In `.venv`, execute:
     ```powershell
     uv pip install "av<18" --python c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe
     ```
  3. Re-run `forensics_multiagent_run\tests\test_m0_challenger.py` to confirm `file_path_transcription_success: true`.

---

## 5. Verification Method

To reproduce this finding and independently verify all 5 assertions:

```powershell
# Execute the Challenger M0 empirical test suite:
& "c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe" `
  "c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tests\test_m0_challenger.py"

# Inspect the generated JSON report:
Get-Content "c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\reports\challenger_m0_empirical_report.json"
```

**Invalidation Condition**:
If `model.transcribe(r"c:\...\PTT-20210304-WA0001.opus")` succeeds and returns transcript segments without raising `TypeError`, this finding is resolved and the milestone may be marked `APPROVED`.
