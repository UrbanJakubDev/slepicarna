# 1. Definice cest (uprav si jméno projektu, pokud se liší)
PROJECT_NAME="Slepicarna"
OBSIDIAN_PATH="/Users/jakuburban/Documents/Obsidian Vault/01_Projekty/$PROJECT_NAME"
LOCAL_DOCS_DIR="$(pwd)/docs"

echo "🚀 Zahajuji migraci dokumentace pro $PROJECT_NAME..."

# 2. Odstranění starého symlinku v projektu, pokud existuje
if [ -L "docs" ]; then
    echo "🗑️ Odstraňuji starý symlink 'docs' v projektu..."
    rm docs
fi

# 3. Vytvoření fyzické složky v projektu
mkdir -p docs

# 4. Přesun souborů z Obsidianu do projektu
if [ -d "$OBSIDIAN_PATH" ]; then
    echo "📦 Přesouvám soubory z Obsidianu do $LOCAL_DOCS_DIR..."
    mv "$OBSIDIAN_PATH/"* "$LOCAL_DOCS_DIR/"
    # Smazání fyzické složky v Obsidianu (teď už by měla být prázdná nebo jen se skrytými soubory)
    rm -rf "$OBSIDIAN_PATH"
else
    echo "⚠️ Složka v Obsidianu nebyla nalezena na $OBSIDIAN_PATH"
fi

# 5. Vytvoření symlinku v Obsidianu směrem na disk
echo "🔗 Vytvářím symlink v Obsidianu na $LOCAL_DOCS_DIR..."
ln -s "$LOCAL_DOCS_DIR" "$OBSIDIAN_PATH"

echo "✅ Hotovo! Dokumentace je nyní fyzicky v projektu (pro Git) a v Obsidianu je na ni odkaz."