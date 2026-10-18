export default async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST 요청만 지원합니다." }), {
      status: 405, headers: { "Content-Type": "application/json" }
    });
  }

  const apiKey = Netlify.env.get("ELEVENLABS_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({
      error: "Netlify 환경변수 ELEVENLABS_API_KEY가 설정되지 않았습니다. README의 설정 방법을 확인해 주세요."
    }), { status: 503, headers: { "Content-Type": "application/json" } });
  }

  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: "요청 내용을 읽을 수 없습니다." }), {
      status: 400, headers: { "Content-Type": "application/json" }
    });
  }

  const { title = "지구를 지켜요", lyrics = "", genre = "bright pop", mood = "hopeful", voice = "clear vocals with group chorus" } = body;
  if (typeof lyrics !== "string" || !lyrics.trim()) {
    return new Response(JSON.stringify({ error: "가사를 입력해 주세요." }), {
      status: 400, headers: { "Content-Type": "application/json" }
    });
  }
  if (lyrics.length > 6000) {
    return new Response(JSON.stringify({ error: "가사는 6,000자 이내로 입력해 주세요." }), {
      status: 413, headers: { "Content-Type": "application/json" }
    });
  }

  const prompt = [
    `Create a complete Korean-language song titled "${String(title).slice(0,70)}" for a 5th-grade elementary school environmental education project.`,
    `Genre and sound: ${String(genre).slice(0,180)}. Mood: ${String(mood).slice(0,100)}.`,
    `Vocals: ${String(voice).slice(0,180)}. Sing the Korean lyrics below clearly and naturally; preserve the lyrics as closely as possible.`,
    `Make the chorus memorable and suitable for a school class to sing together. Use a polished, age-appropriate arrangement.`,
    `The song should communicate the seriousness of pollution and encourage protecting nature through practical actions.`,
    `Lyrics:\n${lyrics}`
  ].join("\n\n");

  try {
    const upstream = await fetch("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128", {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json", "Accept": "audio/mpeg" },
      body: JSON.stringify({
        prompt,
        music_length_ms: 120000,
        model_id: "music_v2_5"
      })
    });

    if (!upstream.ok) {
      const details = await upstream.text();
      let message = `음악 서비스 응답 오류 (${upstream.status})`;
      try {
        const parsed = JSON.parse(details);
        message = parsed.detail?.message || parsed.detail?.data?.message || parsed.message || message;
      } catch {}
      return new Response(JSON.stringify({
        error: `${message}. API 계정의 Music API 이용 권한과 사용량을 확인해 주세요.`
      }), { status: 502, headers: { "Content-Type": "application/json" } });
    }

    const audio = await upstream.arrayBuffer();
    return new Response(audio, {
      status: 200,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "audio/mpeg",
        "Content-Disposition": `attachment; filename="eco-song.mp3"`,
        "Cache-Control": "no-store"
      }
    });
  } catch {
    return new Response(JSON.stringify({
      error: "음악 생성 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요."
    }), { status: 502, headers: { "Content-Type": "application/json" } });
  }
};
