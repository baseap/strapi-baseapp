import json
import os
import re

def snake_to_title(name):
    """Convert snake_case to Title Case"""
    words = name.split('_')
    return ' '.join(word.capitalize() for word in words)

def add_labels_to_schema(filepath):
    """Add label properties to all attributes in a schema"""
    with open(filepath, 'r') as f:
        schema = json.load(f)
    
    if 'attributes' not in schema:
        return False
    
    modified = False
    for attr_name, attr_def in schema['attributes'].items():
        if isinstance(attr_def, dict) and 'label' not in attr_def:
            # Skip relations and components without labels
            if attr_def.get('type') not in ['relation', 'component']:
                attr_def['label'] = snake_to_title(attr_name)
                modified = True
    
    if modified:
        with open(filepath, 'w') as f:
            json.dump(schema, f, indent=2)
        print(f"✓ {filepath}")
        return True
    return False

# Process all collections
count = 0
for root, dirs, files in os.walk('src/api'):
    for file in files:
        if file == 'schema.json':
            filepath = os.path.join(root, file)
            if add_labels_to_schema(filepath):
                count += 1

print(f"\nModified {count} schemas")
