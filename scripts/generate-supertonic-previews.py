from pathlib import Path

from supertonic import TTS


MODEL_DIR = Path("public/supertonic")
OUTPUT_DIR = Path("public/audio/narrators/supertonic")
VOICES = ("M1", "M2", "M3", "M4", "M5", "F1", "F2", "F3", "F4", "F5")
PREVIEW_TEXT = (
    "Olá! Esta é uma amostra de voz do Live, "
    "gerada por inteligência artificial."
)


def main() -> None:
    tts = TTS(model="supertonic-3", model_dir=MODEL_DIR, auto_download=False)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for voice in VOICES:
        style = tts.get_voice_style(voice_name=voice)
        wav, _ = tts.synthesize(
            text=PREVIEW_TEXT,
            lang="pt",
            voice_style=style,
            total_steps=8,
            speed=1.0,
        )
        output = OUTPUT_DIR / f"{voice.lower()}.wav"
        tts.save_audio(wav, str(output))
        print(f"Generated {output}")


if __name__ == "__main__":
    main()
