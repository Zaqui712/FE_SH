import os

# Function to replace the URL in a file
def replace_in_file(file_path, old_text, new_text):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            file_data = file.read()
        
        # Check if the text to replace exists in the file
        if old_text in file_data:
            file_data = file_data.replace(old_text, new_text)
            
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(file_data)
            print(f"Updated: {file_path}")
        else:
            print(f"No change needed: {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

# Function to walk through the directory and process all .js files
def process_js_files(directory, old_text, new_text):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.js'):
                file_path = os.path.join(root, file)
                replace_in_file(file_path, old_text, new_text)

# Replace URLs in a folder
if __name__ == "__main__":
    directory_path = "G:\Github_Repos\FE_SH\src"  # Directory path to process
    old_url = "http://4.211.87.132:5000/"
    new_url = "http://localhost:5000/"
    
    process_js_files(directory_path, old_url, new_url)
    print("Replacement complete.")
