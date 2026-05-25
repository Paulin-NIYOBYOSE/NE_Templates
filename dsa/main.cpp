/**
 * =============================================================================
 * DSA PRACTICAL EXAM TEMPLATE - GENERIC CONSOLE APPLICATION
 * =============================================================================
 * 
 * A reusable template for Data Structures and Algorithms practical exams.
 * Supports both command-line and menu-based interaction styles.
 * 
 * FEATURES:
 * - Generic entity management (add, list, search, edit, delete)
 * - Graph support with adjacency matrix and weight matrix
 * - File persistence (CSV for entities, text for matrices)
 * - Sorting by multiple fields
 * - Input validation with meaningful error messages
 * - Case-insensitive command parsing
 * 
 * COMPILATION:
 *   g++ -std=c++17 -o dsa_app main.cpp
 *   OR use: make
 * 
 * USAGE:
 *   ./dsa_app
 * 
 * TO ADAPT TO A NEW SCENARIO:
 * 1. Edit config.h to change entity names, field names, file names
 * 2. Modify the Item struct fields if needed (add/remove fields)
 * 3. Update validation rules in config.h
 * 4. Choose interaction style (command or menu) in config.h
 * 
 * =============================================================================
 */

#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <string>
#include <algorithm>
#include <iomanip>
#include <cctype>
#include <cstring>
#include <limits>

#include "config.h"

using namespace std;

// =============================================================================
// DATA STRUCTURES
// =============================================================================

/**
 * Generic Entity Structure
 * 
 * TO CUSTOMIZE FOR YOUR EXAM:
 * - Rename fields (e.g., quantity -> budget, population, score)
 * - Add new fields (e.g., string category, double price)
 * - Remove unused fields
 * - Update all functions that use this struct
 */
struct Item {
    int id;
    string name;
    int quantity;      // Can represent: budget, population, score, count, etc.
    string date;       // Format: YYYY-MM-DD
    
    // Default constructor
    Item() : id(0), name(""), quantity(0), date("") {}
    
    // Parameterized constructor
    Item(int _id, const string& _name, int _qty, const string& _date)
        : id(_id), name(_name), quantity(_qty), date(_date) {}
};

// =============================================================================
// GLOBAL DATA STORAGE
// =============================================================================

vector<Item> items;                              // Main entity storage
int adjacencyMatrix[MAX_ENTITIES][MAX_ENTITIES]; // Connection matrix (0/1)
int weightMatrix[MAX_ENTITIES][MAX_ENTITIES];    // Weight/cost matrix
int entityCount = 0;                             // Current number of entities

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Convert string to lowercase (for case-insensitive comparison)
 */
string toLower(const string& str) {
    string result = str;
    transform(result.begin(), result.end(), result.begin(), ::tolower);
    return result;
}

/**
 * Trim whitespace from both ends of a string
 */
string trim(const string& str) {
    size_t start = str.find_first_not_of(" \t\r\n");
    if (start == string::npos) return "";
    size_t end = str.find_last_not_of(" \t\r\n");
    return str.substr(start, end - start + 1);
}

/**
 * Case-insensitive string comparison
 */
bool equalsIgnoreCase(const string& a, const string& b) {
    return toLower(a) == toLower(b);
}

/**
 * Check if string contains only digits
 */
bool isNumeric(const string& str) {
    if (str.empty()) return false;
    for (char c : str) {
        if (!isdigit(c)) return false;
    }
    return true;
}

/**
 * Validate date format (YYYY-MM-DD)
 */
bool isValidDate(const string& date) {
    if (date.length() != 10) return false;
    if (date[4] != '-' || date[7] != '-') return false;
    
    string year = date.substr(0, 4);
    string month = date.substr(5, 2);
    string day = date.substr(8, 2);
    
    if (!isNumeric(year) || !isNumeric(month) || !isNumeric(day)) return false;
    
    int y = stoi(year);
    int m = stoi(month);
    int d = stoi(day);
    
    if (y < 1900 || y > 2100) return false;
    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;
    
    return true;
}

/**
 * Clear input buffer
 */
void clearInputBuffer() {
    cin.clear();
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
}

/**
 * Print a horizontal separator line
 */
void printSeparator(int width = 70) {
    cout << string(width, '-') << endl;
}

/**
 * Print centered text
 */
void printCentered(const string& text, int width = 70) {
    int padding = (width - text.length()) / 2;
    cout << string(max(0, padding), ' ') << text << endl;
}

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Check if ID is valid (within range and not duplicate)
 */
bool isValidId(int id, bool checkDuplicate = true) {
    if (id < MIN_ID || id > MAX_ID) {
        cout << "Error: " << FIELD_ID << " must be between " << MIN_ID << " and " << MAX_ID << endl;
        return false;
    }
    
    if (checkDuplicate) {
        for (const auto& item : items) {
            if (item.id == id) {
                cout << "Error: " << ENTITY_NAME_SINGULAR << " with " << FIELD_ID << " " << id << " already exists." << endl;
                return false;
            }
        }
    }
    return true;
}

/**
 * Check if name is valid (not empty, within length)
 */
bool isValidName(const string& name) {
    if (name.empty()) {
        cout << "Error: " << FIELD_NAME << " cannot be empty." << endl;
        return false;
    }
    if (name.length() > MAX_NAME_LENGTH) {
        cout << "Error: " << FIELD_NAME << " cannot exceed " << MAX_NAME_LENGTH << " characters." << endl;
        return false;
    }
    return true;
}

/**
 * Check if quantity is valid (within range)
 */
bool isValidQuantity(int qty) {
    if (qty < MIN_QUANTITY || qty > MAX_QUANTITY) {
        cout << "Error: " << FIELD_QUANTITY << " must be between " << MIN_QUANTITY << " and " << MAX_QUANTITY << endl;
        return false;
    }
    return true;
}

/**
 * Find item index by ID (-1 if not found)
 */
int findItemIndexById(int id) {
    for (size_t i = 0; i < items.size(); i++) {
        if (items[i].id == id) return i;
    }
    return -1;
}

/**
 * Find item index by name (case-insensitive, -1 if not found)
 */
int findItemIndexByName(const string& name) {
    for (size_t i = 0; i < items.size(); i++) {
        if (equalsIgnoreCase(items[i].name, name)) return i;
    }
    return -1;
}

// =============================================================================
// CORE OPERATIONS
// =============================================================================

/**
 * Initialize matrices to default values
 */
void initializeMatrices() {
    for (int i = 0; i < MAX_ENTITIES; i++) {
        for (int j = 0; j < MAX_ENTITIES; j++) {
            adjacencyMatrix[i][j] = NO_CONNECTION;
            weightMatrix[i][j] = NO_WEIGHT;
        }
    }
}

/**
 * Add a new entity
 * Returns true if successful, false otherwise
 */
bool addItem(int id, const string& name, int quantity, const string& date) {
    // Validate all fields
    if (!isValidId(id)) return false;
    if (!isValidName(name)) return false;
    if (!isValidQuantity(quantity)) return false;
    if (!isValidDate(date)) {
        cout << "Error: Invalid date format. Use " << DATE_FORMAT << endl;
        return false;
    }
    
    // Check capacity
    if (items.size() >= MAX_ENTITIES) {
        cout << "Error: Maximum capacity (" << MAX_ENTITIES << ") reached." << endl;
        return false;
    }
    
    // Add the item
    items.push_back(Item(id, name, quantity, date));
    entityCount++;
    
    cout << ENTITY_NAME_SINGULAR << " added successfully. Total: " << items.size() << endl;
    return true;
}

/**
 * Add item interactively (prompts user for input)
 */
bool addItemInteractive() {
    int id, quantity;
    string name, date;
    
    cout << "\n=== Add New " << ENTITY_NAME_SINGULAR << " ===" << endl;
    
    // Get ID
    cout << FIELD_ID << " (" << MIN_ID << "-" << MAX_ID << "): ";
    if (!(cin >> id)) {
        clearInputBuffer();
        cout << "Error: Invalid " << FIELD_ID << " format." << endl;
        return false;
    }
    clearInputBuffer();
    
    // Get Name
    cout << FIELD_NAME << ": ";
    getline(cin, name);
    name = trim(name);
    
    // Get Quantity
    cout << FIELD_QUANTITY << " (" << MIN_QUANTITY << "-" << MAX_QUANTITY << "): ";
    if (!(cin >> quantity)) {
        clearInputBuffer();
        cout << "Error: Invalid " << FIELD_QUANTITY << " format." << endl;
        return false;
    }
    clearInputBuffer();
    
    // Get Date
    cout << FIELD_DATE << " (" << DATE_FORMAT << "): ";
    getline(cin, date);
    date = trim(date);
    
    return addItem(id, name, quantity, date);
}

// =============================================================================
// SORTING FUNCTIONS
// =============================================================================

/**
 * Comparator for sorting by ID
 */
bool compareById(const Item& a, const Item& b) {
    return SORT_ASCENDING ? (a.id < b.id) : (a.id > b.id);
}

/**
 * Comparator for sorting by Name (case-insensitive)
 */
bool compareByName(const Item& a, const Item& b) {
    string nameA = toLower(a.name);
    string nameB = toLower(b.name);
    return SORT_ASCENDING ? (nameA < nameB) : (nameA > nameB);
}

/**
 * Comparator for sorting by Quantity
 */
bool compareByQuantity(const Item& a, const Item& b) {
    return SORT_ASCENDING ? (a.quantity < b.quantity) : (a.quantity > b.quantity);
}

/**
 * Comparator for sorting by Date
 */
bool compareByDate(const Item& a, const Item& b) {
    return SORT_ASCENDING ? (a.date < b.date) : (a.date > b.date);
}

/**
 * Sort items by specified field
 * field: 0=ID, 1=Name, 2=Quantity, 3=Date
 */
void sortItems(int field = DEFAULT_SORT_FIELD) {
    switch (field) {
        case 0:
            sort(items.begin(), items.end(), compareById);
            cout << ENTITY_NAME_PLURAL << " sorted by " << FIELD_ID << endl;
            break;
        case 1:
            sort(items.begin(), items.end(), compareByName);
            cout << ENTITY_NAME_PLURAL << " sorted by " << FIELD_NAME << endl;
            break;
        case 2:
            sort(items.begin(), items.end(), compareByQuantity);
            cout << ENTITY_NAME_PLURAL << " sorted by " << FIELD_QUANTITY << endl;
            break;
        case 3:
            sort(items.begin(), items.end(), compareByDate);
            cout << ENTITY_NAME_PLURAL << " sorted by " << FIELD_DATE << endl;
            break;
        default:
            sort(items.begin(), items.end(), compareById);
            cout << ENTITY_NAME_PLURAL << " sorted by " << FIELD_ID << " (default)" << endl;
    }
}

// =============================================================================
// DISPLAY FUNCTIONS
// =============================================================================

/**
 * Display table header
 */
void displayTableHeader() {
    printSeparator();
    cout << left 
         << setw(COL_WIDTH_ID) << FIELD_ID
         << setw(COL_WIDTH_NAME) << FIELD_NAME
         << setw(COL_WIDTH_QUANTITY) << FIELD_QUANTITY
         << setw(COL_WIDTH_DATE) << FIELD_DATE
         << endl;
    printSeparator();
}

/**
 * Display a single item
 */
void displayItem(const Item& item) {
    cout << left 
         << setw(COL_WIDTH_ID) << item.id
         << setw(COL_WIDTH_NAME) << item.name
         << setw(COL_WIDTH_QUANTITY) << item.quantity
         << setw(COL_WIDTH_DATE) << item.date
         << endl;
}

/**
 * List all entities
 */
void listItems(bool sorted = true, int sortField = DEFAULT_SORT_FIELD) {
    if (items.empty()) {
        cout << "No " << ENTITY_NAME_PLURAL << " found." << endl;
        return;
    }
    
    if (sorted) {
        sortItems(sortField);
    }
    
    cout << "\n=== " << ENTITY_NAME_PLURAL << " List (" << items.size() << " total) ===" << endl;
    displayTableHeader();
    
    for (const auto& item : items) {
        displayItem(item);
    }
    printSeparator();
}

/**
 * Search for an entity by ID
 */
void searchById(int id) {
    int index = findItemIndexById(id);
    if (index == -1) {
        cout << ENTITY_NAME_SINGULAR << " with " << FIELD_ID << " " << id << " not found." << endl;
        return;
    }
    
    cout << "\n=== Search Result ===" << endl;
    displayTableHeader();
    displayItem(items[index]);
    printSeparator();
}

/**
 * Search for an entity by name (case-insensitive, partial match)
 */
void searchByName(const string& name) {
    vector<Item> results;
    string searchTerm = toLower(name);
    
    for (const auto& item : items) {
        if (toLower(item.name).find(searchTerm) != string::npos) {
            results.push_back(item);
        }
    }
    
    if (results.empty()) {
        cout << "No " << ENTITY_NAME_PLURAL << " found matching '" << name << "'." << endl;
        return;
    }
    
    cout << "\n=== Search Results (" << results.size() << " found) ===" << endl;
    displayTableHeader();
    for (const auto& item : results) {
        displayItem(item);
    }
    printSeparator();
}

/**
 * Search interactively
 */
void searchItemInteractive() {
    cout << "\nSearch by: (1) " << FIELD_ID << "  (2) " << FIELD_NAME << endl;
    cout << "Choice: ";
    
    int choice;
    if (!(cin >> choice)) {
        clearInputBuffer();
        cout << "Invalid choice." << endl;
        return;
    }
    clearInputBuffer();
    
    if (choice == 1) {
        cout << "Enter " << FIELD_ID << ": ";
        int id;
        if (!(cin >> id)) {
            clearInputBuffer();
            cout << "Invalid " << FIELD_ID << "." << endl;
            return;
        }
        clearInputBuffer();
        searchById(id);
    } else if (choice == 2) {
        cout << "Enter " << FIELD_NAME << ": ";
        string name;
        getline(cin, name);
        searchByName(trim(name));
    } else {
        cout << "Invalid choice." << endl;
    }
}

/**
 * Edit an existing entity
 */
bool editItem(int id) {
    int index = findItemIndexById(id);
    if (index == -1) {
        cout << ENTITY_NAME_SINGULAR << " with " << FIELD_ID << " " << id << " not found." << endl;
        return false;
    }
    
    Item& item = items[index];
    
    cout << "\n=== Edit " << ENTITY_NAME_SINGULAR << " (ID: " << id << ") ===" << endl;
    cout << "Current values:" << endl;
    displayTableHeader();
    displayItem(item);
    printSeparator();
    
    cout << "\nEnter new values (press Enter to keep current):" << endl;
    
    // Edit Name
    cout << FIELD_NAME << " [" << item.name << "]: ";
    string newName;
    getline(cin, newName);
    newName = trim(newName);
    if (!newName.empty()) {
        if (isValidName(newName)) {
            item.name = newName;
        }
    }
    
    // Edit Quantity
    cout << FIELD_QUANTITY << " [" << item.quantity << "]: ";
    string qtyStr;
    getline(cin, qtyStr);
    qtyStr = trim(qtyStr);
    if (!qtyStr.empty() && isNumeric(qtyStr)) {
        int newQty = stoi(qtyStr);
        if (isValidQuantity(newQty)) {
            item.quantity = newQty;
        }
    }
    
    // Edit Date
    cout << FIELD_DATE << " [" << item.date << "]: ";
    string newDate;
    getline(cin, newDate);
    newDate = trim(newDate);
    if (!newDate.empty()) {
        if (isValidDate(newDate)) {
            item.date = newDate;
        } else {
            cout << "Warning: Invalid date format, keeping original." << endl;
        }
    }
    
    cout << ENTITY_NAME_SINGULAR << " updated successfully." << endl;
    return true;
}

/**
 * Edit item interactively
 */
void editItemInteractive() {
    cout << "Enter " << FIELD_ID << " of " << ENTITY_NAME_SINGULAR << " to edit: ";
    int id;
    if (!(cin >> id)) {
        clearInputBuffer();
        cout << "Invalid " << FIELD_ID << "." << endl;
        return;
    }
    clearInputBuffer();
    editItem(id);
}

/**
 * Delete an entity
 */
bool deleteItem(int id) {
    int index = findItemIndexById(id);
    if (index == -1) {
        cout << ENTITY_NAME_SINGULAR << " with " << FIELD_ID << " " << id << " not found." << endl;
        return false;
    }
    
    // Confirm deletion
    cout << "Are you sure you want to delete " << ENTITY_NAME_SINGULAR << " '" << items[index].name << "'? (y/n): ";
    char confirm;
    cin >> confirm;
    clearInputBuffer();
    
    if (tolower(confirm) != 'y') {
        cout << "Deletion cancelled." << endl;
        return false;
    }
    
    // Remove connections in matrices
    for (int i = 0; i < MAX_ENTITIES; i++) {
        adjacencyMatrix[index][i] = NO_CONNECTION;
        adjacencyMatrix[i][index] = NO_CONNECTION;
        weightMatrix[index][i] = NO_WEIGHT;
        weightMatrix[i][index] = NO_WEIGHT;
    }
    
    items.erase(items.begin() + index);
    entityCount--;
    
    cout << ENTITY_NAME_SINGULAR << " deleted successfully." << endl;
    return true;
}

/**
 * Delete item interactively
 */
void deleteItemInteractive() {
    cout << "Enter " << FIELD_ID << " of " << ENTITY_NAME_SINGULAR << " to delete: ";
    int id;
    if (!(cin >> id)) {
        clearInputBuffer();
        cout << "Invalid " << FIELD_ID << "." << endl;
        return;
    }
    clearInputBuffer();
    deleteItem(id);
}

// =============================================================================
// GRAPH / RELATION FUNCTIONS
// =============================================================================

/**
 * Add a connection between two entities (by index)
 */
bool addConnectionByIndex(int from, int to, bool bidirectional = true) {
    if (from < 0 || from >= (int)items.size() || to < 0 || to >= (int)items.size()) {
        cout << "Error: Invalid entity indices." << endl;
        return false;
    }
    
    if (from == to) {
        cout << "Error: Cannot create self-connection." << endl;
        return false;
    }
    
    adjacencyMatrix[from][to] = 1;
    if (bidirectional) {
        adjacencyMatrix[to][from] = 1;
    }
    
    cout << RELATION_NAME << " added between '" << items[from].name << "' and '" << items[to].name << "'." << endl;
    return true;
}

/**
 * Add a connection between two entities (by ID)
 */
bool addConnection(int fromId, int toId, bool bidirectional = true) {
    int fromIndex = findItemIndexById(fromId);
    int toIndex = findItemIndexById(toId);
    
    if (fromIndex == -1) {
        cout << "Error: " << ENTITY_NAME_SINGULAR << " with " << FIELD_ID << " " << fromId << " not found." << endl;
        return false;
    }
    if (toIndex == -1) {
        cout << "Error: " << ENTITY_NAME_SINGULAR << " with " << FIELD_ID << " " << toId << " not found." << endl;
        return false;
    }
    
    return addConnectionByIndex(fromIndex, toIndex, bidirectional);
}

/**
 * Add connection interactively
 */
void addConnectionInteractive() {
    cout << "\n=== Add " << RELATION_NAME << " ===" << endl;
    
    int fromId, toId;
    cout << "From " << FIELD_ID << ": ";
    if (!(cin >> fromId)) {
        clearInputBuffer();
        cout << "Invalid " << FIELD_ID << "." << endl;
        return;
    }
    
    cout << "To " << FIELD_ID << ": ";
    if (!(cin >> toId)) {
        clearInputBuffer();
        cout << "Invalid " << FIELD_ID << "." << endl;
        return;
    }
    clearInputBuffer();
    
    cout << "Bidirectional? (y/n): ";
    char bidir;
    cin >> bidir;
    clearInputBuffer();
    
    addConnection(fromId, toId, tolower(bidir) == 'y');
}

/**
 * Set weight for a connection (by index)
 */
bool setWeightByIndex(int from, int to, int weight, bool bidirectional = true) {
    if (from < 0 || from >= (int)items.size() || to < 0 || to >= (int)items.size()) {
        cout << "Error: Invalid entity indices." << endl;
        return false;
    }
    
    // Ensure connection exists
    if (adjacencyMatrix[from][to] == NO_CONNECTION) {
        cout << "Warning: No connection exists. Creating connection first." << endl;
        addConnectionByIndex(from, to, bidirectional);
    }
    
    weightMatrix[from][to] = weight;
    if (bidirectional) {
        weightMatrix[to][from] = weight;
    }
    
    cout << "Weight " << weight << " set for " << RELATION_NAME << " between '" 
         << items[from].name << "' and '" << items[to].name << "'." << endl;
    return true;
}

/**
 * Set weight for a connection (by ID)
 */
bool setWeight(int fromId, int toId, int weight, bool bidirectional = true) {
    int fromIndex = findItemIndexById(fromId);
    int toIndex = findItemIndexById(toId);
    
    if (fromIndex == -1 || toIndex == -1) {
        cout << "Error: One or both " << ENTITY_NAME_PLURAL << " not found." << endl;
        return false;
    }
    
    return setWeightByIndex(fromIndex, toIndex, weight, bidirectional);
}

/**
 * Set weight interactively
 */
void setWeightInteractive() {
    cout << "\n=== Set " << RELATION_NAME << " Weight ===" << endl;
    
    int fromId, toId, weight;
    cout << "From " << FIELD_ID << ": ";
    if (!(cin >> fromId)) {
        clearInputBuffer();
        cout << "Invalid " << FIELD_ID << "." << endl;
        return;
    }
    
    cout << "To " << FIELD_ID << ": ";
    if (!(cin >> toId)) {
        clearInputBuffer();
        cout << "Invalid " << FIELD_ID << "." << endl;
        return;
    }
    
    cout << "Weight/Cost: ";
    if (!(cin >> weight)) {
        clearInputBuffer();
        cout << "Invalid weight." << endl;
        return;
    }
    clearInputBuffer();
    
    setWeight(fromId, toId, weight);
}

/**
 * Remove a connection
 */
bool removeConnection(int fromId, int toId, bool bidirectional = true) {
    int fromIndex = findItemIndexById(fromId);
    int toIndex = findItemIndexById(toId);
    
    if (fromIndex == -1 || toIndex == -1) {
        cout << "Error: One or both " << ENTITY_NAME_PLURAL << " not found." << endl;
        return false;
    }
    
    adjacencyMatrix[fromIndex][toIndex] = NO_CONNECTION;
    weightMatrix[fromIndex][toIndex] = NO_WEIGHT;
    
    if (bidirectional) {
        adjacencyMatrix[toIndex][fromIndex] = NO_CONNECTION;
        weightMatrix[toIndex][fromIndex] = NO_WEIGHT;
    }
    
    cout << RELATION_NAME << " removed." << endl;
    return true;
}

/**
 * Display adjacency matrix
 */
void displayAdjacencyMatrix() {
    if (items.empty()) {
        cout << "No " << ENTITY_NAME_PLURAL << " to display." << endl;
        return;
    }
    
    int n = items.size();
    
    cout << "\n=== Adjacency Matrix (" << RELATION_NAME << "s) ===" << endl;
    
    // Header row with IDs
    cout << setw(MATRIX_CELL_WIDTH) << " ";
    for (int i = 0; i < n; i++) {
        cout << setw(MATRIX_CELL_WIDTH) << items[i].id;
    }
    cout << endl;
    
    // Matrix rows
    for (int i = 0; i < n; i++) {
        cout << setw(MATRIX_CELL_WIDTH) << items[i].id;
        for (int j = 0; j < n; j++) {
            cout << setw(MATRIX_CELL_WIDTH) << adjacencyMatrix[i][j];
        }
        cout << endl;
    }
    cout << endl;
}

/**
 * Display weight matrix
 */
void displayWeightMatrix() {
    if (items.empty()) {
        cout << "No " << ENTITY_NAME_PLURAL << " to display." << endl;
        return;
    }
    
    int n = items.size();
    
    cout << "\n=== Weight Matrix (" << RELATION_NAME << " Costs) ===" << endl;
    
    // Header row with IDs
    cout << setw(MATRIX_CELL_WIDTH + 2) << " ";
    for (int i = 0; i < n; i++) {
        cout << setw(MATRIX_CELL_WIDTH + 2) << items[i].id;
    }
    cout << endl;
    
    // Matrix rows
    for (int i = 0; i < n; i++) {
        cout << setw(MATRIX_CELL_WIDTH + 2) << items[i].id;
        for (int j = 0; j < n; j++) {
            if (weightMatrix[i][j] == NO_WEIGHT) {
                cout << setw(MATRIX_CELL_WIDTH + 2) << "-";
            } else {
                cout << setw(MATRIX_CELL_WIDTH + 2) << weightMatrix[i][j];
            }
        }
        cout << endl;
    }
    cout << endl;
}

/**
 * List all connections for an entity
 */
void listConnections(int id) {
    int index = findItemIndexById(id);
    if (index == -1) {
        cout << ENTITY_NAME_SINGULAR << " with " << FIELD_ID << " " << id << " not found." << endl;
        return;
    }
    
    cout << "\n" << RELATION_NAME << "s for '" << items[index].name << "' (ID: " << id << "):" << endl;
    
    bool hasConnections = false;
    for (size_t i = 0; i < items.size(); i++) {
        if (adjacencyMatrix[index][i] == 1) {
            cout << "  -> " << items[i].name << " (ID: " << items[i].id << ")";
            if (weightMatrix[index][i] != NO_WEIGHT) {
                cout << " [Weight: " << weightMatrix[index][i] << "]";
            }
            cout << endl;
            hasConnections = true;
        }
    }
    
    if (!hasConnections) {
        cout << "  No " << RELATION_NAME << "s found." << endl;
    }
}

// =============================================================================
// FILE I/O FUNCTIONS
// =============================================================================

/**
 * Save entities to CSV file
 * Format: id,name,quantity,date
 */
bool saveEntitiesToFile(const string& filename = ENTITIES_FILE) {
    ofstream file(filename);
    if (!file.is_open()) {
        cout << "Error: Could not open file '" << filename << "' for writing." << endl;
        return false;
    }
    
    // Write header
    file << FIELD_ID << "," << FIELD_NAME << "," << FIELD_QUANTITY << "," << FIELD_DATE << endl;
    
    // Write data
    for (const auto& item : items) {
        file << item.id << "," << item.name << "," << item.quantity << "," << item.date << endl;
    }
    
    file.close();
    cout << items.size() << " " << ENTITY_NAME_PLURAL << " saved to '" << filename << "'." << endl;
    return true;
}

/**
 * Load entities from CSV file
 */
bool loadEntitiesFromFile(const string& filename = ENTITIES_FILE) {
    ifstream file(filename);
    if (!file.is_open()) {
        cout << "Note: File '" << filename << "' not found. Starting with empty data." << endl;
        return false;
    }
    
    items.clear();
    string line;
    int lineNum = 0;
    
    while (getline(file, line)) {
        lineNum++;
        
        // Skip header
        if (lineNum == 1) continue;
        
        // Skip empty lines
        if (trim(line).empty()) continue;
        
        // Parse CSV line
        stringstream ss(line);
        string idStr, name, qtyStr, date;
        
        if (!getline(ss, idStr, ',')) continue;
        if (!getline(ss, name, ',')) continue;
        if (!getline(ss, qtyStr, ',')) continue;
        if (!getline(ss, date, ',')) date = trim(date);
        
        // Remove trailing newline/whitespace from date
        date = trim(date);
        
        try {
            int id = stoi(trim(idStr));
            int qty = stoi(trim(qtyStr));
            items.push_back(Item(id, trim(name), qty, date));
        } catch (...) {
            cout << "Warning: Skipping invalid line " << lineNum << " in '" << filename << "'." << endl;
        }
    }
    
    file.close();
    entityCount = items.size();
    cout << items.size() << " " << ENTITY_NAME_PLURAL << " loaded from '" << filename << "'." << endl;
    return true;
}

/**
 * Save adjacency matrix to file
 * Format: First line = number of entities, then matrix rows
 */
bool saveRelationsToFile(const string& filename = RELATIONS_FILE) {
    ofstream file(filename);
    if (!file.is_open()) {
        cout << "Error: Could not open file '" << filename << "' for writing." << endl;
        return false;
    }
    
    int n = items.size();
    
    // Write header with entity IDs
    file << n << endl;
    for (int i = 0; i < n; i++) {
        file << items[i].id;
        if (i < n - 1) file << ",";
    }
    file << endl;
    
    // Write matrix
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            file << adjacencyMatrix[i][j];
            if (j < n - 1) file << ",";
        }
        file << endl;
    }
    
    file.close();
    cout << "Adjacency matrix saved to '" << filename << "'." << endl;
    return true;
}

/**
 * Load adjacency matrix from file
 */
bool loadRelationsFromFile(const string& filename = RELATIONS_FILE) {
    ifstream file(filename);
    if (!file.is_open()) {
        cout << "Note: File '" << filename << "' not found." << endl;
        return false;
    }
    
    string line;
    int n = 0;
    
    // Read number of entities
    if (getline(file, line)) {
        n = stoi(trim(line));
    }
    
    // Skip ID line
    getline(file, line);
    
    // Read matrix
    for (int i = 0; i < n && getline(file, line); i++) {
        stringstream ss(line);
        string val;
        int j = 0;
        while (getline(ss, val, ',') && j < n) {
            adjacencyMatrix[i][j] = stoi(trim(val));
            j++;
        }
    }
    
    file.close();
    cout << "Adjacency matrix loaded from '" << filename << "'." << endl;
    return true;
}

/**
 * Save weight matrix to file
 */
bool saveWeightsToFile(const string& filename = WEIGHTS_FILE) {
    ofstream file(filename);
    if (!file.is_open()) {
        cout << "Error: Could not open file '" << filename << "' for writing." << endl;
        return false;
    }
    
    int n = items.size();
    
    // Write header
    file << n << endl;
    for (int i = 0; i < n; i++) {
        file << items[i].id;
        if (i < n - 1) file << ",";
    }
    file << endl;
    
    // Write matrix
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            file << weightMatrix[i][j];
            if (j < n - 1) file << ",";
        }
        file << endl;
    }
    
    file.close();
    cout << "Weight matrix saved to '" << filename << "'." << endl;
    return true;
}

/**
 * Load weight matrix from file
 */
bool loadWeightsFromFile(const string& filename = WEIGHTS_FILE) {
    ifstream file(filename);
    if (!file.is_open()) {
        cout << "Note: File '" << filename << "' not found." << endl;
        return false;
    }
    
    string line;
    int n = 0;
    
    // Read number of entities
    if (getline(file, line)) {
        n = stoi(trim(line));
    }
    
    // Skip ID line
    getline(file, line);
    
    // Read matrix
    for (int i = 0; i < n && getline(file, line); i++) {
        stringstream ss(line);
        string val;
        int j = 0;
        while (getline(ss, val, ',') && j < n) {
            weightMatrix[i][j] = stoi(trim(val));
            j++;
        }
    }
    
    file.close();
    cout << "Weight matrix loaded from '" << filename << "'." << endl;
    return true;
}

/**
 * Save all data to files
 */
void saveAllData() {
    saveEntitiesToFile();
    saveRelationsToFile();
    saveWeightsToFile();
}

/**
 * Load all data from files
 */
void loadAllData() {
    loadEntitiesFromFile();
    loadRelationsFromFile();
    loadWeightsFromFile();
}

// =============================================================================
// HELP AND DISPLAY FUNCTIONS
// =============================================================================

/**
 * Display help for command-line style
 */
void displayCommandHelp() {
    cout << "\n=== Available Commands ===" << endl;
    cout << left << setw(30) << COMMAND_PREFIX "add <id> <name> <qty> <date>" << "Add new " << ENTITY_NAME_SINGULAR << endl;
    cout << left << setw(30) << COMMAND_PREFIX "addinteractive" << "Add " << ENTITY_NAME_SINGULAR << " interactively" << endl;
    cout << left << setw(30) << COMMAND_PREFIX "slist" << "List all " << ENTITY_NAME_PLURAL << endl;
    cout << left << setw(30) << COMMAND_PREFIX "search <id|name>" << "Search " << ENTITY_NAME_SINGULAR << endl;
    cout << left << setw(30) << COMMAND_PREFIX "edit <id>" << "Edit " << ENTITY_NAME_SINGULAR << endl;
    cout << left << setw(30) << COMMAND_PREFIX "delete <id>" << "Delete " << ENTITY_NAME_SINGULAR << endl;
    cout << left << setw(30) << COMMAND_PREFIX "sort <0-3>" << "Sort (0=ID, 1=Name, 2=Qty, 3=Date)" << endl;
    cout << left << setw(30) << "connect <from_id> <to_id>" << "Add " << RELATION_NAME << endl;
    cout << left << setw(30) << "weight <from_id> <to_id> <w>" << "Set " << RELATION_NAME << " weight" << endl;
    cout << left << setw(30) << "adjmatrix" << "Display adjacency matrix" << endl;
    cout << left << setw(30) << "weightmatrix" << "Display weight matrix" << endl;
    cout << left << setw(30) << "connections <id>" << "List " << RELATION_NAME << "s for " << ENTITY_NAME_SINGULAR << endl;
    cout << left << setw(30) << "save" << "Save all data to files" << endl;
    cout << left << setw(30) << "load" << "Load all data from files" << endl;
    cout << left << setw(30) << "help" << "Show this help" << endl;
    cout << left << setw(30) << "exit" << "Exit program" << endl;
    cout << endl;
}

/**
 * Display menu for menu style
 */
void displayMenu() {
    cout << "\n========================================" << endl;
    cout << "    " << ENTITY_NAME_SINGULAR << " Management System" << endl;
    cout << "========================================" << endl;
    cout << "1. Add " << ENTITY_NAME_SINGULAR << endl;
    cout << "2. List " << ENTITY_NAME_PLURAL << endl;
    cout << "3. Search " << ENTITY_NAME_SINGULAR << endl;
    cout << "4. Edit " << ENTITY_NAME_SINGULAR << endl;
    cout << "5. Delete " << ENTITY_NAME_SINGULAR << endl;
    cout << "6. Add " << RELATION_NAME << endl;
    cout << "7. Set " << RELATION_NAME << " Weight" << endl;
    cout << "8. Display Matrices" << endl;
    cout << "9. Save/Load Data" << endl;
    cout << "0. Exit" << endl;
    cout << "----------------------------------------" << endl;
    cout << "Enter choice: ";
}

/**
 * Display sub-menu for matrices
 */
void displayMatricesSubMenu() {
    cout << "\n--- Matrix Display ---" << endl;
    cout << "1. Adjacency Matrix" << endl;
    cout << "2. Weight Matrix" << endl;
    cout << "3. Both Matrices" << endl;
    cout << "4. List " << RELATION_NAME << "s for " << ENTITY_NAME_SINGULAR << endl;
    cout << "0. Back" << endl;
    cout << "Choice: ";
}

/**
 * Display sub-menu for save/load
 */
void displaySaveLoadSubMenu() {
    cout << "\n--- Save/Load Data ---" << endl;
    cout << "1. Save All" << endl;
    cout << "2. Load All" << endl;
    cout << "3. Save " << ENTITY_NAME_PLURAL << " Only" << endl;
    cout << "4. Load " << ENTITY_NAME_PLURAL << " Only" << endl;
    cout << "0. Back" << endl;
    cout << "Choice: ";
}

// =============================================================================
// COMMAND PARSER (Command-line style)
// =============================================================================

#ifdef USE_COMMAND_STYLE

/**
 * Parse and execute command
 */
bool parseCommand(const string& input) {
    string cmd = trim(input);
    if (cmd.empty()) return true;
    
    // Tokenize input
    vector<string> tokens;
    stringstream ss(cmd);
    string token;
    while (ss >> token) {
        tokens.push_back(token);
    }
    
    if (tokens.empty()) return true;
    
    string command = toLower(tokens[0]);
    
    // Exit command
    if (command == "exit" || command == "quit" || command == "q") {
        return false;
    }
    
    // Help command
    if (command == "help" || command == "?") {
        displayCommandHelp();
        return true;
    }
    
    // Add command: itemadd <id> <name> <qty> <date>
    if (command == COMMAND_PREFIX "add") {
        if (tokens.size() < 5) {
            cout << "Usage: " << COMMAND_PREFIX << "add <id> <name> <quantity> <date>" << endl;
            return true;
        }
        try {
            int id = stoi(tokens[1]);
            string name = tokens[2];
            int qty = stoi(tokens[3]);
            string date = tokens[4];
            addItem(id, name, qty, date);
        } catch (...) {
            cout << "Error: Invalid arguments." << endl;
        }
        return true;
    }
    
    // Add interactive
    if (command == COMMAND_PREFIX "addinteractive" || command == COMMAND_PREFIX "addi") {
        addItemInteractive();
        return true;
    }
    
    // List command
    if (command == COMMAND_PREFIX "slist" || command == COMMAND_PREFIX "list" || command == "list") {
        int sortField = DEFAULT_SORT_FIELD;
        if (tokens.size() > 1) {
            try {
                sortField = stoi(tokens[1]);
            } catch (...) {}
        }
        listItems(true, sortField);
        return true;
    }
    
    // Search command
    if (command == COMMAND_PREFIX "search" || command == "search") {
        if (tokens.size() < 2) {
            searchItemInteractive();
        } else {
            // Try as ID first
            try {
                int id = stoi(tokens[1]);
                searchById(id);
            } catch (...) {
                // Search by name
                searchByName(tokens[1]);
            }
        }
        return true;
    }
    
    // Edit command
    if (command == COMMAND_PREFIX "edit" || command == "edit") {
        if (tokens.size() < 2) {
            editItemInteractive();
        } else {
            try {
                int id = stoi(tokens[1]);
                editItem(id);
            } catch (...) {
                cout << "Error: Invalid " << FIELD_ID << "." << endl;
            }
        }
        return true;
    }
    
    // Delete command
    if (command == COMMAND_PREFIX "delete" || command == "delete") {
        if (tokens.size() < 2) {
            deleteItemInteractive();
        } else {
            try {
                int id = stoi(tokens[1]);
                deleteItem(id);
            } catch (...) {
                cout << "Error: Invalid " << FIELD_ID << "." << endl;
            }
        }
        return true;
    }
    
    // Sort command
    if (command == COMMAND_PREFIX "sort" || command == "sort") {
        int field = DEFAULT_SORT_FIELD;
        if (tokens.size() > 1) {
            try {
                field = stoi(tokens[1]);
            } catch (...) {}
        }
        sortItems(field);
        listItems(false);
        return true;
    }
    
    // Connect command
    if (command == "connect" || command == "link" || command == "addconnection") {
        if (tokens.size() < 3) {
            addConnectionInteractive();
        } else {
            try {
                int from = stoi(tokens[1]);
                int to = stoi(tokens[2]);
                addConnection(from, to);
            } catch (...) {
                cout << "Error: Invalid arguments." << endl;
            }
        }
        return true;
    }
    
    // Weight command
    if (command == "weight" || command == "setweight") {
        if (tokens.size() < 4) {
            setWeightInteractive();
        } else {
            try {
                int from = stoi(tokens[1]);
                int to = stoi(tokens[2]);
                int w = stoi(tokens[3]);
                setWeight(from, to, w);
            } catch (...) {
                cout << "Error: Invalid arguments." << endl;
            }
        }
        return true;
    }
    
    // Adjacency matrix
    if (command == "adjmatrix" || command == "adj" || command == "matrix") {
        displayAdjacencyMatrix();
        return true;
    }
    
    // Weight matrix
    if (command == "weightmatrix" || command == "weights") {
        displayWeightMatrix();
        return true;
    }
    
    // Connections for entity
    if (command == "connections" || command == "links") {
        if (tokens.size() < 2) {
            cout << "Enter " << FIELD_ID << ": ";
            int id;
            if (cin >> id) {
                clearInputBuffer();
                listConnections(id);
            }
        } else {
            try {
                int id = stoi(tokens[1]);
                listConnections(id);
            } catch (...) {
                cout << "Error: Invalid " << FIELD_ID << "." << endl;
            }
        }
        return true;
    }
    
    // Save command
    if (command == "save") {
        saveAllData();
        return true;
    }
    
    // Load command
    if (command == "load") {
        loadAllData();
        return true;
    }
    
    // Unknown command
    cout << "Unknown command: '" << tokens[0] << "'. Type 'help' for available commands." << endl;
    return true;
}

/**
 * Command-line style main loop
 */
void runCommandLoop() {
    cout << "\n========================================" << endl;
    cout << "  " << ENTITY_NAME_SINGULAR << " Management System" << endl;
    cout << "  (Command-line Mode)" << endl;
    cout << "========================================" << endl;
    cout << "Type 'help' for available commands." << endl;
    
    string input;
    bool running = true;
    
    while (running) {
        cout << "\n> ";
        getline(cin, input);
        running = parseCommand(input);
    }
    
    cout << "Goodbye!" << endl;
}

#endif // USE_COMMAND_STYLE

// =============================================================================
// MENU HANDLER (Menu style)
// =============================================================================

#ifdef USE_MENU_STYLE

/**
 * Handle matrices sub-menu
 */
void handleMatricesMenu() {
    int choice;
    do {
        displayMatricesSubMenu();
        if (!(cin >> choice)) {
            clearInputBuffer();
            continue;
        }
        clearInputBuffer();
        
        switch (choice) {
            case 1:
                displayAdjacencyMatrix();
                break;
            case 2:
                displayWeightMatrix();
                break;
            case 3:
                displayAdjacencyMatrix();
                displayWeightMatrix();
                break;
            case 4: {
                cout << "Enter " << FIELD_ID << ": ";
                int id;
                if (cin >> id) {
                    clearInputBuffer();
                    listConnections(id);
                } else {
                    clearInputBuffer();
                }
                break;
            }
            case 0:
                break;
            default:
                cout << "Invalid choice." << endl;
        }
    } while (choice != 0);
}

/**
 * Handle save/load sub-menu
 */
void handleSaveLoadMenu() {
    int choice;
    do {
        displaySaveLoadSubMenu();
        if (!(cin >> choice)) {
            clearInputBuffer();
            continue;
        }
        clearInputBuffer();
        
        switch (choice) {
            case 1:
                saveAllData();
                break;
            case 2:
                loadAllData();
                break;
            case 3:
                saveEntitiesToFile();
                break;
            case 4:
                loadEntitiesFromFile();
                break;
            case 0:
                break;
            default:
                cout << "Invalid choice." << endl;
        }
    } while (choice != 0);
}

/**
 * Menu style main loop
 */
void runMenuLoop() {
    int choice;
    
    do {
        displayMenu();
        if (!(cin >> choice)) {
            clearInputBuffer();
            cout << "Invalid input. Please enter a number." << endl;
            continue;
        }
        clearInputBuffer();
        
        switch (choice) {
            case 1:
                addItemInteractive();
                break;
            case 2:
                listItems();
                break;
            case 3:
                searchItemInteractive();
                break;
            case 4:
                editItemInteractive();
                break;
            case 5:
                deleteItemInteractive();
                break;
            case 6:
                addConnectionInteractive();
                break;
            case 7:
                setWeightInteractive();
                break;
            case 8:
                handleMatricesMenu();
                break;
            case 9:
                handleSaveLoadMenu();
                break;
            case 0:
                cout << "Exiting..." << endl;
                break;
            default:
                cout << "Invalid choice. Please try again." << endl;
        }
    } while (choice != 0);
    
    cout << "Goodbye!" << endl;
}

#endif // USE_MENU_STYLE

// =============================================================================
// MAIN FUNCTION
// =============================================================================

int main() {
    // Initialize matrices
    initializeMatrices();
    
    // Load existing data from files
    loadAllData();
    
    // Run the appropriate interaction style
    #ifdef USE_COMMAND_STYLE
        runCommandLoop();
    #endif
    
    #ifdef USE_MENU_STYLE
        runMenuLoop();
    #endif
    
    // Auto-save on exit (optional - uncomment if desired)
    // saveAllData();
    
    return 0;
}
