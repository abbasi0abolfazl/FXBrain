#!/usr/bin/env python3
import os
import shutil

def trim(s: str) -> str:
    return s.strip()

def path_parts(p: str):
    # جدا کردن حفظ‌کننده‌ی پیشوند ./ در صورت وجود
    prefix = ""
    if p.startswith("./"):
        prefix = "./"
        p = p[2:]
    parts = p.split(os.sep) if p else []
    return prefix, parts

def should_skip(parts):
    return "node_modules" in parts

def join(prefix, parts):
    return prefix + os.sep.join(parts) if parts else prefix or "."

def process(root: str, dry_run: bool = True):
    # پیمایش از پایین به بالا
    for dirpath, dirnames, filenames in os.walk(root, topdown=False):
        prefix, parts = path_parts(dirpath)
        if should_skip(parts):
            continue

        # برای هر فایل: بررسی و جابجایی با مسیرهای اصلاح‌شده
        for name in filenames:
            old_path = os.path.join(dirpath, name)
            if should_skip(path_parts(old_path)[1]):
                continue
            new_name = trim(name)
            # اصلاح تمام بخش‌های dirpath
            new_dir_parts = [trim(p) for p in parts]
            new_dir = join(prefix, new_dir_parts)
            new_path = os.path.join(new_dir, new_name)
            if new_dir != dirpath or new_name != name:
                if os.path.exists(new_path):
                    print(f"CONFLICT: {old_path} -> {new_path} (exists) -- skipped")
                else:
                    print(("DRY: " if dry_run else "MOVED: ") + f"{old_path} -> {new_path}")
                    if not dry_run:
                        os.makedirs(new_dir, exist_ok=True)
                        shutil.move(old_path, new_path)

        # برای هر دایرکتوری فرزند: ابتدا نام خودشان را trim و در dirnames به‌روزرسانی کنیم
        for i, name in enumerate(list(dirnames)):
            old_path = os.path.join(dirpath, name)
            if should_skip(path_parts(old_path)[1]):
                continue
            new_name = trim(name)
            if new_name != name:
                new_path = os.path.join(dirpath, new_name)
                if os.path.exists(new_path):
                    print(f"CONFLICT: {old_path} -> {new_path} (exists) -- skipped")
                else:
                    print(("DRY: " if dry_run else "MOVED: ") + f"{old_path} -> {new_path}")
                    if not dry_run:
                        shutil.move(old_path, new_path)
                    # به‌روزرسانی dirnames تا os.walk مسیر جدید را استفاده کند
                    dirnames[i] = new_name

        # حالا بررسی و اصلاح خودِ dirpath (بخشی از مسیرهای بالاتر) انجام نمی‌شود اینجا،
        # چون os.walk از پایین به بالا است، بالاترها در تکرارهای بعدی اصلاح خواهند شد.

if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser(description="Trim leading/trailing spaces from file and directory names (skip node_modules).")
    p.add_argument("--root", "-r", default=".", help="Root directory")
    p.add_argument("--apply", "-a", action="store_true", help="Apply changes")
    args = p.parse_args()
    process(args.root, dry_run=not args.apply)
