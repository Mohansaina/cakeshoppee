import os
import sys
import math
import subprocess
import shutil
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import imageio_ffmpeg

FFMPEG_BIN = imageio_ffmpeg.get_ffmpeg_exe()

WIDTH = 1280
HEIGHT = 720
FPS = 25
DURATION_PER_ITEM = 2.0  # seconds per dish
TRANSITION_DURATION = 0.4  # seconds crossfade

# Load the sharp, crystal-clear bakery hero banner
BANNER_PATH = "bakery_hero_banner.jpg"
BASE_BANNER = Image.open(BANNER_PATH).convert("RGB")
BASE_BANNER = BASE_BANNER.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)

# 16 verified, visible, delicious menu images
ITEMS = [
    'blackforest.jpg',
    'redvalvet.jpg',
    'whiteforst.jpg',
    'freshfruit.jpg',
    'chocoalmond.jpg',
    'chcikentikkapizza.jpg',
    'pannerpizza.jpg',
    'mushroompizza.jpg',
    'chicekntikkaburger.jpg',
    'paneerburger.jpg',
    'chcikenchessesandwich.jpg',
    'oreomilkshake.jpg',
    'strawberrymilkshake.jpg',
    'chocolatemilkshake.jpg',
    'frenchfries.jpg',
    'chickennuggets.jpg'
]

def render_banner_only_frame(progress):
    """
    Shows the crystal-clear bakery cover banner with a gentle slow cinematic zoom.
    """
    b_zoom = 1.0 + progress * 0.04
    bw, bh = int(WIDTH * b_zoom), int(HEIGHT * b_zoom)
    bg = BASE_BANNER.resize((bw, bh), Image.Resampling.BILINEAR)
    cx = (bw - WIDTH) // 2
    cy = (bh - HEIGHT) // 2
    return bg.crop((cx, cy, cx + WIDTH, cy + HEIGHT))

def render_item_frame(img_path, progress):
    """
    Renders the dish seamlessly over the crystal-clear bakery cover banner:
    - Cover banner remains completely sharp and visible (no heavy blur!).
    - Centered appetizing dish with natural soft drop shadow.
    - Zero text overlays.
    """
    # 1. Background: Sharp, clear bakery banner with gentle cinematic drift
    b_zoom = 1.0 + progress * 0.02
    bw, bh = int(WIDTH * b_zoom), int(HEIGHT * b_zoom)
    bg = BASE_BANNER.resize((bw, bh), Image.Resampling.BILINEAR)
    cx = (bw - WIDTH) // 2
    cy = (bh - HEIGHT) // 2
    bg = bg.crop((cx, cy, cx + WIDTH, cy + HEIGHT))
    
    # 2. Foreground: Centered appetizing dish
    img = Image.open(img_path).convert('RGB')
    iw, ih = img.size
    
    zoom = 1.0 + progress * 0.04
    target_h = int(HEIGHT * 0.78 * zoom)
    scale_fg = target_h / ih
    target_w = int(iw * scale_fg)
    
    if target_w > int(WIDTH * 0.82):
        target_w = int(WIDTH * 0.82)
        target_h = int(ih * (target_w / iw))
        
    fg_resized = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    # Rounded corners
    corner_radius = 22
    mask = Image.new('L', (target_w, target_h), 0)
    dm = ImageDraw.Draw(mask)
    dm.rounded_rectangle([0, 0, target_w, target_h], radius=corner_radius, fill=255)
    
    # Soft natural ambient drop shadow so the dish sits naturally on the counter
    shadow_pad = 28
    shadow = Image.new('RGBA', (target_w + shadow_pad * 2, target_h + shadow_pad * 2), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle(
        [shadow_pad - 6, shadow_pad - 4, shadow_pad + target_w + 6, shadow_pad + target_h + 8],
        radius=corner_radius + 4,
        fill=(0, 0, 0, 195)
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(22))
    
    fx = (WIDTH - target_w) // 2
    fy = (HEIGHT - target_h) // 2
    
    # Paste shadow & dish
    bg.paste(shadow, (fx - shadow_pad, fy - shadow_pad), shadow)
    bg.paste(fg_resized, (fx, fy), mask)
    
    # Subtle golden border
    d_bg = ImageDraw.Draw(bg)
    d_bg.rounded_rectangle(
        [fx, fy, fx + target_w, fy + target_h],
        radius=corner_radius,
        outline=(235, 190, 85),
        width=3
    )
    
    return bg

def main():
    output_mp4 = "hero_video.mp4"
    print(f"Generating sharp-banner hero video ({WIDTH}x{HEIGHT} @ {FPS}fps) to: {output_mp4}")
    
    cmd = [
        FFMPEG_BIN,
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        output_mp4
    ]
    
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    
    item_frames_count = int(DURATION_PER_ITEM * FPS)
    trans_frames_count = int(TRANSITION_DURATION * FPS)
    
    # Scene sequence: starts with cover banner, then features each dish
    scenes = [("banner", None)] + [("dish", item) for item in ITEMS]
    
    prev_last_frame = None
    
    for idx, (stype, item_path) in enumerate(scenes):
        dur = 2.4 if stype == "banner" else DURATION_PER_ITEM
        f_count = int(dur * FPS)
        name = "Cover Banner" if stype == "banner" else item_path
        print(f"Rendering scene {idx + 1}/{len(scenes)}: {name}...")
        
        if stype == "banner":
            f_start = render_banner_only_frame(0.0)
            f_end = render_banner_only_frame(1.0)
        else:
            f_start = render_item_frame(item_path, 0.0)
            f_end = render_item_frame(item_path, 1.0)
            
        for f in range(f_count):
            prog = f / float(f_count)
            current_frame = Image.blend(f_start, f_end, prog)
            
            if prev_last_frame is not None and f < trans_frames_count:
                t_prog = f / float(trans_frames_count)
                t_alpha = 0.5 * (1.0 - math.cos(math.pi * t_prog))
                blended = Image.blend(prev_last_frame, current_frame, t_alpha)
                proc.stdin.write(blended.tobytes())
            else:
                proc.stdin.write(current_frame.tobytes())
                
            if f == f_count - 1:
                prev_last_frame = current_frame.copy()
                
    proc.stdin.close()
    proc.wait()
    print("Video generation finished successfully!")
    
    # Save a fresh poster image
    poster = render_banner_only_frame(0.0)
    poster.save("hero_poster.jpg", quality=92)
    print("Saved hero_poster.jpg")
    
    # Copy to public folder
    shutil.copy2("hero_video.mp4", "public/hero_video.mp4")
    shutil.copy2("hero_poster.jpg", "public/hero_poster.jpg")
    print("Updated public/hero_video.mp4 and public/hero_poster.jpg")

if __name__ == "__main__":
    main()
