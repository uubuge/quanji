import json
import os
import sys
import urllib.parse
from collections import defaultdict

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_FILE = os.path.join(BASE_DIR, "PDF2_文件列表.txt")
APP_MAPPING_FILE = r"C:\Users\quejing\Documents\GitHub\新建文件夹 (3)\data\app_mapping_git.json"
DATA_DIR = os.path.join(BASE_DIR, "data")
DIST_DIR = os.path.join(BASE_DIR, "dist")

MODELSCOPE_BASE = "https://modelscope.cn/datasets/quejing/quanjiPDF/resolve/master/"

def clean_name(name):
    name = name.replace('.pdf', '')
    if name.startswith('电子书'):
        name = name[3:]
    if name.startswith('美式书'):
        name = name[3:]
    elif name.startswith('英式书'):
        name = name[3:]
    return name.strip()

def load_app_mapping():
    if not os.path.exists(APP_MAPPING_FILE):
        print("警告：未找到APP映射文件", APP_MAPPING_FILE)
        return {}
    
    with open(APP_MAPPING_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    mapping = {}
    for key, value in data.items():
        parts = key.split('|')
        if len(parts) >= 3:
            dir_path = parts[0]
            base_name = parts[1]
            if dir_path:
                full_path = dir_path + '/' + base_name + '.pdf'
            else:
                full_path = base_name + '.pdf'
            mapping[full_path] = value
    
    return mapping

def main():
    print("开始构建...", flush=True)
    
    if not os.path.exists(INPUT_FILE):
        print("错误：找不到文件", INPUT_FILE)
        sys.exit(1)

    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(DIST_DIR, exist_ok=True)

    print("加载APP映射数据...", flush=True)
    app_mapping = load_app_mapping()
    print("已加载", len(app_mapping), "条APP映射", flush=True)

    categories = defaultdict(list)

    print("正在读取文件列表...", flush=True)
    with open(INPUT_FILE, "r", encoding="utf-8-sig") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            
            parts = line.replace("\\", "/").split("/", 1)
            category = parts[0]
            file_path = parts[1] if len(parts) > 1 else ""
            filename = file_path.split("/")[-1] if file_path else ""
            
            file_dir = os.path.dirname(file_path)
            
            if file_dir:
                full_dir = category + "/" + file_dir
            else:
                full_dir = category
            
            clean_filename = clean_name(filename)
            
            if full_dir:
                full_pdf_path = full_dir + "/" + clean_filename + ".pdf"
            else:
                full_pdf_path = clean_filename + ".pdf"
            
            app_data = app_mapping.get(full_pdf_path, {'computer': [], 'mobile': []})
            
            computer_paths = []
            for url in app_data.get('computer', []):
                base = 'https://modelscope.cn/datasets/quejing/'
                if url.startswith(base):
                    computer_paths.append(url[len(base):])
                else:
                    computer_paths.append(url)
            
            mobile_paths = []
            for url in app_data.get('mobile', []):
                base = 'https://modelscope.cn/datasets/quejing/'
                if url.startswith(base):
                    mobile_paths.append(url[len(base):])
                else:
                    mobile_paths.append(url)
            
            categories[category].append({
                "name": filename,
                "path": file_path,
                "computer": computer_paths,
                "mobile": mobile_paths
            })

    print("共发现", len(categories), "个分类", flush=True)

    BATCH_SIZE = 1200
    cat_list = []
    total_files = 0

    for cat_name, files in sorted(categories.items()):
        safe_name = cat_name.replace("\\", "_").replace("/", "_")
        total = len(files)
        total_files += total
        batches = []

        if total <= BATCH_SIZE:
            fname = safe_name + ".json"
            file_path = os.path.join(DATA_DIR, fname)
            with open(file_path, "w", encoding="utf-8") as fout:
                json.dump(files, fout, ensure_ascii=False, separators=(",", ":"))
            batches.append({"file": fname, "count": total, "offset": 0})
            print("  ", cat_name, ":", total, "个文件", flush=True)
        else:
            for i in range(0, total, BATCH_SIZE):
                chunk = files[i:i + BATCH_SIZE]
                batch_num = i // BATCH_SIZE + 1
                total_batches = (total + BATCH_SIZE - 1) // BATCH_SIZE
                fname = safe_name + "_p" + str(batch_num) + ".json"
                file_path = os.path.join(DATA_DIR, fname)
                with open(file_path, "w", encoding="utf-8") as fout:
                    json.dump(chunk, fout, ensure_ascii=False, separators=(",", ":"))
                batches.append({"file": fname, "count": len(chunk), "offset": i})
                print("  ", cat_name, "(批次", batch_num, "/", total_batches, "):", len(chunk), "个文件", flush=True)

        cat_list.append({
            "name": cat_name,
            "count": total,
            "batches": batches
        })

    index_path = os.path.join(DATA_DIR, "categories.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump({"baseUrl": MODELSCOPE_BASE, "categories": cat_list}, f, ensure_ascii=False)
    print("\n已写入 categories.json (", len(cat_list), "个分类, 共", total_files, "个文件)", flush=True)

    app_stats = {
        "total_pdf": total_files,
        "total_with_computer": sum(1 for cat in categories.values() for f in cat if f.get('computer')),
        "total_with_mobile": sum(1 for cat in categories.values() for f in cat if f.get('mobile'))
    }
    print("\nAPP映射统计:")
    print("  有电脑版(ZIP):", app_stats['total_with_computer'])
    print("  有手机版(APK):", app_stats['total_with_mobile'])

    print("\n数据文件已生成到:", DATA_DIR, flush=True)

if __name__ == "__main__":
    main()