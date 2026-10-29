import json
import os
import base64
import subprocess

TRANSCRIPT_PATH = r"C:\Users\akshi\.gemini\antigravity\brain\823cbb5f-4391-48a5-a4f2-4de01e03f2d2\.system_generated\logs\transcript_full.jsonl"
OUTPUT_HTML = r"c:\Users\akshi\OneDrive\Desktop\akshit\CyberShield_Conversation_Report.html"
OUTPUT_PDF = r"c:\Users\akshi\OneDrive\Desktop\akshit\CyberShield_Conversation_Report.pdf"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def get_base64_image(img_path):
    if os.path.exists(img_path):
        with open(img_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("utf-8")
            return f"data:image/jpeg;base64,{encoded}"
    return ""

def main():
    turns = []
    current_turn = None

    with open(TRANSCRIPT_PATH, "r", encoding="utf-8") as f:
        for line in f:
            obj = json.loads(line)
            idx = obj.get("step_index")
            if idx is None or idx < 235:
                continue

            stype = obj.get("type")
            content = obj.get("content", "")

            if stype == "USER_INPUT":
                # Extract clean user query
                user_text = content
                if "<USER_REQUEST>" in user_text:
                    user_text = user_text.split("<USER_REQUEST>")[1].split("</USER_REQUEST>")[0].strip()
                
                # Check for attached media
                media_list = obj.get("media", [])
                image_uris = [m["uri"] for m in media_list if "uri" in m]

                current_turn = {
                    "step_index": idx,
                    "user_query": user_text,
                    "images": image_uris,
                    "assistant_response": ""
                }
                turns.append(current_turn)

            elif stype == "PLANNER_RESPONSE" and current_turn is not None:
                # Capture planner text
                if content:
                    current_turn["assistant_response"] += content + "\n\n"

    print(f"Loaded {len(turns)} conversation turns starting from Prompt 2.")

    # Build HTML
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CyberShield One — Complete Conversation Transcript Report</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

  @page {{
    size: A4;
    margin: 14mm 12mm 14mm 12mm;
  }}

  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }}

  body {{
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    color: #1e293b;
    background: #ffffff;
    line-height: 1.55;
    font-size: 10pt;
  }}

  .header-card {{
    background: linear-gradient(135deg, #040814 0%, #0b132b 100%);
    color: #ffffff;
    padding: 20px 24px;
    border-radius: 10px;
    margin-bottom: 22px;
    border: 1px solid #1c2541;
  }}

  .header-badge {{
    display: inline-block;
    background: rgba(0, 245, 212, 0.15);
    color: #00f5d4;
    font-size: 7.5pt;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 12px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }}

  .header-title {{
    font-size: 18pt;
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 4px;
  }}

  .header-sub {{
    font-size: 9.5pt;
    color: #94a3b8;
  }}

  .turn-container {{
    margin-bottom: 26px;
    page-break-inside: avoid;
  }}

  .turn-header {{
    display: flex;
    align-items: center;
    justifyContent: space-between;
    background: #f1f5f9;
    border-left: 4px solid #3a86ff;
    padding: 8px 14px;
    border-radius: 4px;
    margin-bottom: 12px;
  }}

  .turn-title {{
    font-size: 11pt;
    font-weight: 700;
    color: #0f172a;
  }}

  .turn-step {{
    font-size: 8pt;
    font-family: 'JetBrains Mono', monospace;
    color: #64748b;
  }}

  .user-box {{
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 14px;
  }}

  .user-label {{
    font-size: 8pt;
    font-weight: 700;
    color: #2563eb;
    text-transform: uppercase;
    margin-bottom: 4px;
  }}

  .user-prompt {{
    font-size: 10pt;
    font-weight: 600;
    color: #0f172a;
  }}

  .assistant-box {{
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 16px 18px;
  }}

  .assistant-label {{
    font-size: 8pt;
    font-weight: 700;
    color: #0d9488;
    text-transform: uppercase;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }}

  .assistant-content {{
    font-size: 9.5pt;
    color: #334155;
    line-height: 1.6;
  }}

  .assistant-content h2, .assistant-content h3, .assistant-content h4 {{
    color: #0f172a;
    margin-top: 14px;
    margin-bottom: 6px;
  }}

  .assistant-content h3 {{ font-size: 11pt; }}
  .assistant-content h4 {{ font-size: 10pt; }}

  .assistant-content p {{
    margin-bottom: 8px;
  }}

  .assistant-content ul, .assistant-content ol {{
    margin-left: 20px;
    margin-bottom: 10px;
  }}

  .assistant-content li {{
    margin-bottom: 4px;
  }}

  .screenshot-img {{
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    margin: 8px 0 12px 0;
    box-shadow: 0 4px 10px rgba(0,0,0,0.06);
  }}

  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
    font-size: 8.5pt;
  }}

  th, td {{
    border: 1px solid #e2e8f0;
    padding: 6px 8px;
    text-align: left;
  }}

  th {{
    background: #f1f5f9;
    font-weight: 700;
    color: #1e293b;
  }}

  code {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    background: #f1f5f9;
    padding: 2px 4px;
    border-radius: 3px;
    color: #0f172a;
  }}

  pre {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 8pt;
    background: #0f172a;
    color: #f8fafc;
    padding: 10px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 8px 0;
  }}

  .badge {{
    display: inline-block;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 7.5pt;
    font-weight: 700;
  }}

  .badge-critical {{ background: #ffe4e6; color: #e11d48; }}
  .badge-clean {{ background: #ccfbf1; color: #0d9488; }}
</style>
</head>
<body>

<div class="header-card">
  <div class="header-badge">MNIT Hackathon Project Documentation</div>
  <div class="header-title">CyberShield One — Interactive Technical Q&amp;A</div>
  <div class="header-sub">
    Tagline: “One Platform. Multiple Threats. One Smarter Defence.” &bull; Complete Conversation Transcript from Prompt 2 Onwards
  </div>
</div>
"""

    for i, turn in enumerate(turns, start=1):
        # Format markdown in assistant content cleanly
        resp_html = format_markdown_to_html(turn["assistant_response"])
        
        # Images HTML
        imgs_html = ""
        for img_uri in turn["images"]:
            b64 = get_base64_image(img_uri)
            if b64:
                imgs_html += f'<div style="margin: 10px 0;"><img class="screenshot-img" src="{b64}" alt="User Uploaded Screenshot" /></div>'

        html += f"""
<div class="turn-container">
  <div class="turn-header">
    <div class="turn-title">Discussion Turn #{i}</div>
    <div class="turn-step">Step Index: {turn["step_index"]}</div>
  </div>

  <div class="user-box">
    <div class="user-label">User Query</div>
    <div class="user-prompt">"{turn["user_query"]}"</div>
    {imgs_html}
  </div>

  <div class="assistant-box">
    <div class="assistant-label">CyberShield Technical Response &amp; Implementation</div>
    <div class="assistant-content">
      {resp_html}
    </div>
  </div>
</div>
"""

    html += """
</body>
</html>
"""

    with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
        f.write(html)
    print("HTML saved to", OUTPUT_HTML)

    # Now print to PDF with Chrome headless
    cmd = [
        CHROME_PATH,
        "--headless",
        "--disable-gpu",
        f"--print-to-pdf={OUTPUT_PDF}",
        OUTPUT_HTML
    ]
    subprocess.run(cmd, check=True)
    if os.path.exists(OUTPUT_PDF):
        size = os.path.getsize(OUTPUT_PDF)
        print(f"SUCCESS: PDF successfully generated! Path: {OUTPUT_PDF} ({size} bytes)")
    else:
        print("ERROR: PDF was not created.")

def format_markdown_to_html(text):
    import re
    # Simple markdown parser for headers, lists, code, and bold
    lines = text.split("\n")
    out = []
    in_code = False
    in_ul = False

    for line in lines:
        if line.startswith("```"):
            if in_code:
                out.append("</pre>")
                in_code = False
            else:
                out.append("<pre>")
                in_code = True
            continue

        if in_code:
            out.append(line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))
            continue

        # Headers
        if line.startswith("### "):
            if in_ul: out.append("</ul>"); in_ul = False
            out.append(f"<h3>{line[4:]}</h3>")
            continue
        elif line.startswith("## "):
            if in_ul: out.append("</ul>"); in_ul = False
            out.append(f"<h2>{line[3:]}</h2>")
            continue
        elif line.startswith("# "):
            if in_ul: out.append("</ul>"); in_ul = False
            out.append(f"<h1>{line[2:]}</h1>")
            continue

        # Bullet list
        if line.strip().startswith("* ") or line.strip().startswith("- "):
            if not in_ul:
                out.append("<ul>")
                in_ul = True
            item_text = line.strip()[2:]
            out.append(f"<li>{parse_inline(item_text)}</li>")
            continue
        else:
            if in_ul:
                out.append("</ul>")
                in_ul = False

        # Table rows
        if line.startswith("|") and line.endswith("|"):
            continue # We can let standard text flow or parse

        # Normal text
        if line.strip():
            out.append(f"<p>{parse_inline(line)}</p>")

    if in_ul: out.append("</ul>")
    if in_code: out.append("</pre>")

    return "\n".join(out)

def parse_inline(s):
    import re
    # Bold **text**
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    # Inline code `code`
    s = re.sub(r'`(.+?)`', r'<code>\1</code>', s)
    return s

if __name__ == "__main__":
    main()

