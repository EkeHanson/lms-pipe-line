import os
from pathlib import Path

# Set the base directory (relative or absolute)
base_dir = Path('src/pages/dashboard/AdminDashboard/QaulityAssuranceDashboard/IQAManagement')
# Output file where you want to store the combined contents
output_file = Path('all_src_contents.txt')

# File extensions to include
included_extensions = {'.js', '.jsx', '.css'}

with output_file.open('w', encoding='utf-8') as outfile:
    for path in base_dir.rglob('*'):
        if path.is_file() and path.suffix in included_extensions:
            relative_path = path.relative_to(base_dir)
            outfile.write(f"\n\n// === File: {relative_path} ===\n")
            with path.open(encoding='utf-8') as infile:
                try:
                    outfile.write(infile.read())
                except Exception as e:
                    outfile.write(f"// Error reading file: {e}")
