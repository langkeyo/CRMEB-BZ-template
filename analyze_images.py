#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
图片资源分析工具
分析项目中的图片文件，识别重复和可共用的资源
"""

import os
import hashlib
import json
from pathlib import Path
from collections import defaultdict
import re

def get_file_hash(file_path):
    """计算文件的MD5哈希值"""
    hash_md5 = hashlib.md5()
    try:
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None

def analyze_images(root_dir):
    """分析图片文件"""
    # 图片文件扩展名
    image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp'}
    
    # 排除的目录
    exclude_dirs = {'node_modules', 'unpackage', '.git', '.cursor'}
    
    # 存储分析结果
    all_images = []
    hash_groups = defaultdict(list)
    name_groups = defaultdict(list)
    
    # 遍历所有文件
    for root, dirs, files in os.walk(root_dir):
        # 排除特定目录
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix.lower() in image_extensions:
                # 计算相对路径
                rel_path = file_path.relative_to(root_dir)
                
                # 获取文件信息
                file_info = {
                    'path': str(rel_path),
                    'full_path': str(file_path),
                    'name': file_path.name,
                    'stem': file_path.stem,
                    'suffix': file_path.suffix,
                    'size': file_path.stat().st_size if file_path.exists() else 0,
                    'directory': str(rel_path.parent)
                }
                
                # 计算文件哈希
                file_hash = get_file_hash(file_path)
                if file_hash:
                    file_info['hash'] = file_hash
                    hash_groups[file_hash].append(file_info)
                
                # 按文件名分组
                name_groups[file_path.name].append(file_info)
                
                all_images.append(file_info)
    
    return all_images, hash_groups, name_groups

def find_duplicates(hash_groups):
    """找出重复文件"""
    duplicates = {}
    for file_hash, files in hash_groups.items():
        if len(files) > 1:
            duplicates[file_hash] = files
    return duplicates

def find_similar_names(name_groups):
    """找出相似名称的文件"""
    similar_names = {}
    for name, files in name_groups.items():
        if len(files) > 1:
            similar_names[name] = files
    return similar_names

def categorize_images(all_images):
    """按功能分类图片"""
    categories = {
        'icons': [],
        'banners': [],
        'products': [],
        'ui_elements': [],
        'backgrounds': [],
        'avatars': [],
        'logos': [],
        'others': []
    }
    
    # 分类规则
    for img in all_images:
        path_lower = img['path'].lower()
        name_lower = img['name'].lower()
        
        if any(keyword in path_lower for keyword in ['icon', 'ico']):
            categories['icons'].append(img)
        elif any(keyword in path_lower for keyword in ['banner', 'carousel']):
            categories['banners'].append(img)
        elif any(keyword in path_lower for keyword in ['product', 'goods']):
            categories['products'].append(img)
        elif any(keyword in name_lower for keyword in ['logo']):
            categories['logos'].append(img)
        elif any(keyword in name_lower for keyword in ['avatar', 'user']):
            categories['avatars'].append(img)
        elif any(keyword in name_lower for keyword in ['bg', 'background']):
            categories['backgrounds'].append(img)
        elif any(keyword in path_lower for keyword in ['button', 'arrow', 'close', 'back']):
            categories['ui_elements'].append(img)
        else:
            categories['others'].append(img)
    
    return categories

def suggest_common_structure():
    """建议公共目录结构"""
    return {
        'static/common/icons/': '通用图标',
        'static/common/ui/': 'UI元素（按钮、箭头等）',
        'static/common/logos/': 'Logo和品牌图片',
        'static/common/backgrounds/': '背景图片',
        'static/common/avatars/': '默认头像',
        'static/common/placeholders/': '占位图片',
        'static/common/decorations/': '装饰性图片'
    }

def main():
    root_dir = Path('.')
    print("开始分析图片资源...")
    
    # 分析图片
    all_images, hash_groups, name_groups = analyze_images(root_dir)
    
    print(f"总共找到 {len(all_images)} 个图片文件")
    
    # 找出重复文件
    duplicates = find_duplicates(hash_groups)
    print(f"发现 {len(duplicates)} 组重复文件")
    
    # 找出相似名称
    similar_names = find_similar_names(name_groups)
    print(f"发现 {len(similar_names)} 组相同名称文件")
    
    # 分类图片
    categories = categorize_images(all_images)
    
    # 生成报告
    report = {
        'summary': {
            'total_images': len(all_images),
            'duplicate_groups': len(duplicates),
            'similar_name_groups': len(similar_names),
            'categories': {k: len(v) for k, v in categories.items()}
        },
        'duplicates': duplicates,
        'similar_names': similar_names,
        'categories': categories,
        'suggested_structure': suggest_common_structure()
    }
    
    # 保存报告
    with open('image_analysis_report.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    print("\n=== 分析报告 ===")
    print(f"总图片数: {report['summary']['total_images']}")
    print(f"重复文件组: {report['summary']['duplicate_groups']}")
    print(f"相同名称组: {report['summary']['similar_name_groups']}")
    
    print("\n=== 分类统计 ===")
    for category, count in report['summary']['categories'].items():
        print(f"{category}: {count}")
    
    if duplicates:
        print("\n=== 重复文件 ===")
        for i, (file_hash, files) in enumerate(duplicates.items(), 1):
            print(f"\n{i}. 重复组 (Hash: {file_hash[:8]}...):")
            for file_info in files:
                print(f"   - {file_info['path']} ({file_info['size']} bytes)")
    
    print("\n报告已保存到 image_analysis_report.json")
    print("建议的公共目录结构:")
    for path, desc in suggest_common_structure().items():
        print(f"  {path} - {desc}")

if __name__ == "__main__":
    main()
