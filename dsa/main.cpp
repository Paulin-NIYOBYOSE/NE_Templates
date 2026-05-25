/**
 * ===========================================================================
 * DSA PRACTICAL EXAM TEMPLATE
 * ===========================================================================
 * QUICK START:
 *   1. Edit config.h (names, features, files)
 *   2. make && ./dsa_app
 * 
 * ADAPTATION:
 *   - config.h: ENTITY_SINGULAR/PLURAL, FIELD_*, HAS_*, ENABLE_GRAPH
 *   - Below: Modify Item struct if adding custom fields
 * ===========================================================================
 */

#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <string>
#include <algorithm>
#include <iomanip>
#include <cctype>
#include <limits>
#include "config.h"

using namespace std;

// ===========================================================================
// ITEM STRUCT - Modify for custom scenarios
// ===========================================================================
// TO ADD A CUSTOM FIELD:
//   1. Add field here (e.g., string category;)
//   2. Add to constructors
//   3. Update addItem(), displayItem(), saveItems(), loadItems()
// ===========================================================================
struct Item {
    int id;                    // Required: unique identifier
    string name;               // Required: main text field
#if HAS_QUANTITY
    int quantity;              // Optional: numeric value (score, population, etc.)
#endif
#if HAS_DATE
    string date;               // Optional: date string (YYYY-MM-DD)
#endif
    
    // Default constructor
    Item() : id(0), name("") {
#if HAS_QUANTITY
        quantity = 0;
#endif
#if HAS_DATE
        date = "";
#endif
    }
    
    // Parameterized constructor
    Item(int _id, const string& _name, int _qty = 0, const string& _date = "")
        : id(_id), name(_name) {
#if HAS_QUANTITY
        quantity = _qty;
#endif
#if HAS_DATE
        date = _date;
#endif
        (void)_qty; (void)_date;
    }
};

// ===========================================================================
// GLOBAL DATA - Main storage (no need to modify)
// ===========================================================================
vector<Item> items;                              // Dynamic array of entities
#if ENABLE_GRAPH
int adjMatrix[MAX_ENTITIES][MAX_ENTITIES];       // Adjacency matrix (0/1)
int weightMatrix[MAX_ENTITIES][MAX_ENTITIES];    // Weight/cost matrix
#endif

// ===========================================================================
// UTILITY FUNCTIONS - Generic helpers (no need to modify)
// ===========================================================================

// Convert string to lowercase for case-insensitive comparison
string toLower(const string& s) {
    string r = s;
    transform(r.begin(), r.end(), r.begin(), ::tolower);
    return r;
}

string trim(const string& s) {
    size_t start = s.find_first_not_of(" \t\r\n");
    if (start == string::npos) return "";
    size_t end = s.find_last_not_of(" \t\r\n");
    return s.substr(start, end - start + 1);
}

bool isNumeric(const string& s) {
    if (s.empty()) return false;
    size_t start = (s[0] == '-') ? 1 : 0;
    if (start == s.length()) return false;
    for (size_t i = start; i < s.length(); i++)
        if (!isdigit(s[i])) return false;
    return true;
}

void clearInput() {
    cin.clear();
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
}

void printLine(int w = 60) { cout << string(w, '-') << endl; }

// ===========================================================================
// VALIDATION - Modify rules in config.h (MIN_ID, MAX_ID, etc.)
// ===========================================================================

// Validate date format YYYY-MM-DD
bool isValidDate(const string& d) {
    if (d.length() != 10 || d[4] != '-' || d[7] != '-') return false;
    string y = d.substr(0,4), m = d.substr(5,2), day = d.substr(8,2);
    if (!isNumeric(y) || !isNumeric(m) || !isNumeric(day)) return false;
    int yi = stoi(y), mi = stoi(m), di = stoi(day);
    return yi >= 1900 && yi <= 2100 && mi >= 1 && mi <= 12 && di >= 1 && di <= 31;
}

bool validateId(int id, bool checkDup = true) {
    if (id < MIN_ID || id > MAX_ID) {
        cerr << "Error: " << FIELD_ID << " must be " << MIN_ID << "-" << MAX_ID << endl;
        return false;
    }
    if (checkDup) {
        for (const auto& it : items) {
            if (it.id == id) {
                cerr << "Error: " << FIELD_ID << " " << id << " already exists." << endl;
                return false;
            }
        }
    }
    return true;
}

bool validateName(const string& n) {
    if (n.empty()) { cerr << "Error: " << FIELD_NAME << " cannot be empty." << endl; return false; }
    if (n.length() > MAX_NAME_LEN) { cerr << "Error: " << FIELD_NAME << " too long (max " << MAX_NAME_LEN << ")." << endl; return false; }
#if !ALLOW_DUPLICATE_NAMES
    for (const auto& it : items) {
        if (toLower(it.name) == toLower(n)) {
            cerr << "Error: " << FIELD_NAME << " '" << n << "' already exists." << endl;
            return false;
        }
    }
#endif
    return true;
}

#if HAS_QUANTITY
bool validateQty(int q) {
    if (q < MIN_QUANTITY || q > MAX_QUANTITY) {
        cerr << "Error: " << FIELD_QUANTITY << " must be " << MIN_QUANTITY << "-" << MAX_QUANTITY << endl;
        return false;
    }
    return true;
}
#endif

int findById(int id) {
    for (size_t i = 0; i < items.size(); i++)
        if (items[i].id == id) return (int)i;
    return -1;
}

int findByName(const string& n) {
    string ln = toLower(n);
    for (size_t i = 0; i < items.size(); i++)
        if (toLower(items[i].name) == ln) return (int)i;
    return -1;
}

// ===========================================================================
// SORTING - Comparators for std::sort (modify if adding custom fields)
// ===========================================================================
bool cmpId(const Item& a, const Item& b) { return SORT_ASCENDING ? a.id < b.id : a.id > b.id; }
bool cmpName(const Item& a, const Item& b) { return SORT_ASCENDING ? toLower(a.name) < toLower(b.name) : toLower(a.name) > toLower(b.name); }
#if HAS_QUANTITY
bool cmpQty(const Item& a, const Item& b) { return SORT_ASCENDING ? a.quantity < b.quantity : a.quantity > b.quantity; }
#endif
#if HAS_DATE
bool cmpDate(const Item& a, const Item& b) { return SORT_ASCENDING ? a.date < b.date : a.date > b.date; }
#endif

void sortItems(int field = DEFAULT_SORT_FIELD, bool silent = false) {
    switch (field) {
        case 0: sort(items.begin(), items.end(), cmpId); if (!silent) cout << "Sorted by " << FIELD_ID << endl; break;
        case 1: sort(items.begin(), items.end(), cmpName); if (!silent) cout << "Sorted by " << FIELD_NAME << endl; break;
#if HAS_QUANTITY
        case 2: sort(items.begin(), items.end(), cmpQty); if (!silent) cout << "Sorted by " << FIELD_QUANTITY << endl; break;
#endif
#if HAS_DATE
        case 3: sort(items.begin(), items.end(), cmpDate); if (!silent) cout << "Sorted by " << FIELD_DATE << endl; break;
#endif
        default: sort(items.begin(), items.end(), cmpId); break;
    }
}

// ===========================================================================
// DISPLAY - Update if adding custom fields to Item struct
// ===========================================================================

// Print table header row
void displayHeader() {
    printLine();
    cout << left << setw(COL_ID) << FIELD_ID << setw(COL_NAME) << FIELD_NAME;
#if HAS_QUANTITY
    cout << setw(COL_QTY) << FIELD_QUANTITY;
#endif
#if HAS_DATE
    cout << setw(COL_DATE) << FIELD_DATE;
#endif
    cout << endl;
    printLine();
}

void displayItem(const Item& it) {
    cout << left << setw(COL_ID) << it.id << setw(COL_NAME) << it.name;
#if HAS_QUANTITY
    cout << setw(COL_QTY) << it.quantity;
#endif
#if HAS_DATE
    cout << setw(COL_DATE) << it.date;
#endif
    cout << endl;
}

void listItems() {
    if (items.empty()) { cout << "No " << ENTITY_PLURAL << " found." << endl; return; }
#if AUTO_SORT
    sortItems(DEFAULT_SORT_FIELD, true);
#endif
    cout << "\n=== " << ENTITY_PLURAL << " (" << items.size() << ") ===" << endl;
    displayHeader();
    for (const auto& it : items) displayItem(it);
    printLine();
}

// ===========================================================================
// CRUD OPERATIONS - Core functionality (update if adding custom fields)
// ===========================================================================

// Add new entity with validation
bool addItem(int id, const string& name, int qty = 0, const string& date = "") {
    if (!validateId(id)) return false;
    if (!validateName(name)) return false;
#if HAS_QUANTITY
    if (!validateQty(qty)) return false;
#endif
#if HAS_DATE
    if (!date.empty() && !isValidDate(date)) {
        cerr << "Error: Invalid date. Use " << DATE_FMT << endl;
        return false;
    }
#endif
    if (items.size() >= MAX_ENTITIES) {
        cerr << "Error: Max capacity (" << MAX_ENTITIES << ") reached." << endl;
        return false;
    }
    items.push_back(Item(id, name, qty, date));
#if AUTO_SORT
    sortItems(DEFAULT_SORT_FIELD, true);
#endif
    cout << ENTITY_SINGULAR << " added. Total: " << items.size() << endl;
    return true;
}

bool addItemInteractive() {
    cout << "\n=== Add " << ENTITY_SINGULAR << " ===" << endl;
    
    int id;
    cout << FIELD_ID << " (" << MIN_ID << "-" << MAX_ID << "): ";
    if (!(cin >> id)) { clearInput(); cerr << "Invalid input." << endl; return false; }
    clearInput();
    
    string name;
    cout << FIELD_NAME << ": ";
    getline(cin, name);
    name = trim(name);
    
    int qty = 0;
#if HAS_QUANTITY
    cout << FIELD_QUANTITY << " (" << MIN_QUANTITY << "-" << MAX_QUANTITY << "): ";
    if (!(cin >> qty)) { clearInput(); cerr << "Invalid input." << endl; return false; }
    clearInput();
#endif
    
    string date = "";
#if HAS_DATE
    cout << FIELD_DATE << " (" << DATE_FMT << "): ";
    getline(cin, date);
    date = trim(date);
#endif
    
    return addItem(id, name, qty, date);
}

void searchById(int id) {
    int idx = findById(id);
    if (idx == -1) { cout << ENTITY_SINGULAR << " not found." << endl; return; }
    cout << "\n=== Found ===" << endl;
    displayHeader();
    displayItem(items[idx]);
    printLine();
}

void searchByName(const string& name) {
    string ln = toLower(name);
    vector<Item> results;
    for (const auto& it : items)
        if (toLower(it.name).find(ln) != string::npos) results.push_back(it);
    if (results.empty()) { cout << "No matches for '" << name << "'." << endl; return; }
    cout << "\n=== Results (" << results.size() << ") ===" << endl;
    displayHeader();
    for (const auto& it : results) displayItem(it);
    printLine();
}

void searchInteractive() {
    cout << "Search by (1)" << FIELD_ID << " (2)" << FIELD_NAME << ": ";
    int c; cin >> c; clearInput();
    if (c == 1) {
        cout << FIELD_ID << ": "; int id; cin >> id; clearInput();
        searchById(id);
    } else if (c == 2) {
        cout << FIELD_NAME << ": "; string n; getline(cin, n);
        searchByName(trim(n));
    }
}

bool editItem(int id) {
    int idx = findById(id);
    if (idx == -1) { cerr << ENTITY_SINGULAR << " not found." << endl; return false; }
    Item& it = items[idx];
    
    cout << "\n=== Edit " << ENTITY_SINGULAR << " " << id << " ===" << endl;
    displayHeader(); displayItem(it); printLine();
    cout << "(Press Enter to keep current)\n";
    
    cout << FIELD_NAME << " [" << it.name << "]: ";
    string s; getline(cin, s); s = trim(s);
    if (!s.empty() && validateName(s)) it.name = s;
    
#if HAS_QUANTITY
    cout << FIELD_QUANTITY << " [" << it.quantity << "]: ";
    getline(cin, s); s = trim(s);
    if (!s.empty() && isNumeric(s)) {
        int q = stoi(s);
        if (validateQty(q)) it.quantity = q;
    }
#endif

#if HAS_DATE
    cout << FIELD_DATE << " [" << it.date << "]: ";
    getline(cin, s); s = trim(s);
    if (!s.empty()) {
        if (isValidDate(s)) it.date = s;
        else cerr << "Invalid date, keeping original." << endl;
    }
#endif

#if AUTO_SORT
    sortItems(DEFAULT_SORT_FIELD, true);
#endif
    cout << ENTITY_SINGULAR << " updated." << endl;
    return true;
}

void editInteractive() {
    cout << FIELD_ID << " to edit: "; int id;
    if (!(cin >> id)) { clearInput(); return; }
    clearInput();
    editItem(id);
}

bool deleteItem(int id) {
    int idx = findById(id);
    if (idx == -1) { cerr << ENTITY_SINGULAR << " not found." << endl; return false; }
    
    cout << "Delete '" << items[idx].name << "'? (y/n): ";
    char c; cin >> c; clearInput();
    if (tolower(c) != 'y') { cout << "Cancelled." << endl; return false; }
    
#if ENABLE_GRAPH
    // Clear connections
    for (int i = 0; i < MAX_ENTITIES; i++) {
        adjMatrix[idx][i] = adjMatrix[i][idx] = NO_CONN;
        weightMatrix[idx][i] = weightMatrix[i][idx] = NO_WEIGHT;
    }
#endif
    items.erase(items.begin() + idx);
    cout << ENTITY_SINGULAR << " deleted." << endl;
    return true;
}

void deleteInteractive() {
    cout << FIELD_ID << " to delete: "; int id;
    if (!(cin >> id)) { clearInput(); return; }
    clearInput();
    deleteItem(id);
}

// ===========================================================================
// GRAPH FUNCTIONS - Adjacency matrix operations (disable with ENABLE_GRAPH=false)
// ===========================================================================
#if ENABLE_GRAPH

// Initialize matrices to default values
void initGraph() {
    for (int i = 0; i < MAX_ENTITIES; i++)
        for (int j = 0; j < MAX_ENTITIES; j++) {
            adjMatrix[i][j] = NO_CONN;
            weightMatrix[i][j] = NO_WEIGHT;
        }
}

bool addConnection(int fromId, int toId) {
    int fi = findById(fromId), ti = findById(toId);
    if (fi == -1 || ti == -1) { cerr << "Error: " << ENTITY_SINGULAR << " not found." << endl; return false; }
    if (fi == ti) { cerr << "Error: Cannot self-connect." << endl; return false; }
    
    adjMatrix[fi][ti] = 1;
#if GRAPH_UNDIRECTED
    adjMatrix[ti][fi] = 1;
#endif
    cout << RELATION_NAME << " added: " << items[fi].name << " -> " << items[ti].name << endl;
    return true;
}

void addConnectionInteractive() {
    cout << "\n=== Add " << RELATION_NAME << " ===" << endl;
    int from, to;
    cout << "From " << FIELD_ID << ": "; cin >> from;
    cout << "To " << FIELD_ID << ": "; cin >> to;
    clearInput();
    addConnection(from, to);
}

bool setWeight(int fromId, int toId, int w) {
    int fi = findById(fromId), ti = findById(toId);
    if (fi == -1 || ti == -1) { cerr << "Error: " << ENTITY_SINGULAR << " not found." << endl; return false; }
    
    if (adjMatrix[fi][ti] == NO_CONN) {
        cout << "Creating connection first..." << endl;
        addConnection(fromId, toId);
    }
    
    weightMatrix[fi][ti] = w;
#if GRAPH_UNDIRECTED
    weightMatrix[ti][fi] = w;
#endif
    cout << "Weight " << w << " set." << endl;
    return true;
}

void setWeightInteractive() {
    cout << "\n=== Set Weight ===" << endl;
    int from, to, w;
    cout << "From " << FIELD_ID << ": "; cin >> from;
    cout << "To " << FIELD_ID << ": "; cin >> to;
    cout << "Weight: "; cin >> w;
    clearInput();
    setWeight(from, to, w);
}

void displayAdjMatrix() {
    if (items.empty()) { cout << "No data." << endl; return; }
    int n = items.size();
    cout << "\n=== Adjacency Matrix ===" << endl;
    cout << setw(COL_MATRIX) << " ";
    for (int i = 0; i < n; i++) cout << setw(COL_MATRIX) << items[i].id;
    cout << endl;
    for (int i = 0; i < n; i++) {
        cout << setw(COL_MATRIX) << items[i].id;
        for (int j = 0; j < n; j++) cout << setw(COL_MATRIX) << adjMatrix[i][j];
        cout << endl;
    }
}

void displayWeightMatrix() {
    if (items.empty()) { cout << "No data." << endl; return; }
    int n = items.size();
    cout << "\n=== Weight Matrix ===" << endl;
    cout << setw(COL_MATRIX) << " ";
    for (int i = 0; i < n; i++) cout << setw(COL_MATRIX) << items[i].id;
    cout << endl;
    for (int i = 0; i < n; i++) {
        cout << setw(COL_MATRIX) << items[i].id;
        for (int j = 0; j < n; j++) {
            if (weightMatrix[i][j] == NO_WEIGHT) cout << setw(COL_MATRIX) << "-";
            else cout << setw(COL_MATRIX) << weightMatrix[i][j];
        }
        cout << endl;
    }
}

void listConnections(int id) {
    int idx = findById(id);
    if (idx == -1) { cout << ENTITY_SINGULAR << " not found." << endl; return; }
    cout << "\n" << RELATION_NAME << "s for " << items[idx].name << ":" << endl;
    bool found = false;
    for (size_t i = 0; i < items.size(); i++) {
        if (adjMatrix[idx][i] == 1) {
            cout << "  -> " << items[i].name;
            if (weightMatrix[idx][i] != NO_WEIGHT) cout << " [" << weightMatrix[idx][i] << "]";
            cout << endl;
            found = true;
        }
    }
    if (!found) cout << "  None" << endl;
}

#endif // ENABLE_GRAPH

// ===========================================================================
// FILE I/O - Update if adding custom fields to Item struct
// ===========================================================================

// Save entities to CSV file
bool saveItems(const string& fn = FILE_ITEMS) {
    ofstream f(fn);
    if (!f) { cerr << "Error: Cannot write " << fn << endl; return false; }
    
    // Header
    f << FIELD_ID << "," << FIELD_NAME;
#if HAS_QUANTITY
    f << "," << FIELD_QUANTITY;
#endif
#if HAS_DATE
    f << "," << FIELD_DATE;
#endif
    f << endl;
    
    // Data
    for (const auto& it : items) {
        f << it.id << "," << it.name;
#if HAS_QUANTITY
        f << "," << it.quantity;
#endif
#if HAS_DATE
        f << "," << it.date;
#endif
        f << endl;
    }
    f.close();
    cout << items.size() << " " << ENTITY_PLURAL << " saved to " << fn << endl;
    return true;
}

bool loadItems(const string& fn = FILE_ITEMS) {
    ifstream f(fn);
    if (!f) { cout << "Note: " << fn << " not found." << endl; return false; }
    
    items.clear();
    string line;
    int lineNum = 0;
    
    while (getline(f, line)) {
        lineNum++;
        if (lineNum == 1) continue; // Skip header
        if (trim(line).empty()) continue;
        
        stringstream ss(line);
        string tok;
        
        if (!getline(ss, tok, ',')) continue;
        int id = stoi(trim(tok));
        
        if (!getline(ss, tok, ',')) continue;
        string name = trim(tok);
        
        int qty = 0;
#if HAS_QUANTITY
        if (getline(ss, tok, ',')) qty = stoi(trim(tok));
#endif
        
        string date = "";
#if HAS_DATE
        if (getline(ss, tok, ',')) date = trim(tok);
        else if (getline(ss, tok)) date = trim(tok);
#endif
        
        items.push_back(Item(id, name, qty, date));
    }
    f.close();
    cout << items.size() << " " << ENTITY_PLURAL << " loaded from " << fn << endl;
    return true;
}

#if ENABLE_GRAPH
bool saveGraph(const string& adjFn = FILE_CONNECTIONS, const string& wFn = FILE_WEIGHTS) {
    int n = items.size();
    
    // Save adjacency
    ofstream fa(adjFn);
    if (!fa) { cerr << "Error: Cannot write " << adjFn << endl; return false; }
    fa << n << endl;
    for (int i = 0; i < n; i++) fa << (i ? "," : "") << items[i].id;
    fa << endl;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) fa << (j ? "," : "") << adjMatrix[i][j];
        fa << endl;
    }
    fa.close();
    
    // Save weights
    ofstream fw(wFn);
    if (!fw) { cerr << "Error: Cannot write " << wFn << endl; return false; }
    fw << n << endl;
    for (int i = 0; i < n; i++) fw << (i ? "," : "") << items[i].id;
    fw << endl;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) fw << (j ? "," : "") << weightMatrix[i][j];
        fw << endl;
    }
    fw.close();
    
    cout << "Graph saved." << endl;
    return true;
}

bool loadGraph(const string& adjFn = FILE_CONNECTIONS, const string& wFn = FILE_WEIGHTS) {
    // Load adjacency
    ifstream fa(adjFn);
    if (fa) {
        string line;
        int n = 0;
        if (getline(fa, line)) n = stoi(trim(line));
        getline(fa, line); // Skip IDs
        for (int i = 0; i < n && getline(fa, line); i++) {
            stringstream ss(line);
            string v;
            for (int j = 0; j < n && getline(ss, v, ','); j++)
                adjMatrix[i][j] = stoi(trim(v));
        }
        fa.close();
        cout << "Adjacency loaded from " << adjFn << endl;
    } else {
        cout << "Note: " << adjFn << " not found." << endl;
    }
    
    // Load weights
    ifstream fw(wFn);
    if (fw) {
        string line;
        int n = 0;
        if (getline(fw, line)) n = stoi(trim(line));
        getline(fw, line); // Skip IDs
        for (int i = 0; i < n && getline(fw, line); i++) {
            stringstream ss(line);
            string v;
            for (int j = 0; j < n && getline(ss, v, ','); j++)
                weightMatrix[i][j] = stoi(trim(v));
        }
        fw.close();
        cout << "Weights loaded from " << wFn << endl;
    } else {
        cout << "Note: " << wFn << " not found." << endl;
    }
    return true;
}
#endif

void saveAll() {
    saveItems();
#if ENABLE_GRAPH
    saveGraph();
#endif
}

void loadAll() {
    loadItems();
#if ENABLE_GRAPH
    loadGraph();
#endif
}

// ===========================================================================
// SEED DATA - Sample data for testing (enable with SEED_ON_START=true)
// ===========================================================================
// Modify this function to add scenario-specific test data
void seedData() {
#if SEED_ON_START
    if (!items.empty()) return;
    cout << "Seeding sample data..." << endl;
    // Add sample entities - modify for your scenario
    addItem(1, "Alpha", 100, "2024-01-15");
    addItem(2, "Beta", 200, "2024-02-20");
    addItem(3, "Gamma", 150, "2024-03-10");
#if ENABLE_GRAPH
    // Add sample connections
    addConnection(1, 2);
    addConnection(2, 3);
    setWeight(1, 2, 10);
    setWeight(2, 3, 20);
#endif
#endif
}

// ===========================================================================
// HELP - Command list (auto-generated from config)
// ===========================================================================
#ifdef USE_COMMAND_MODE
void showHelp() {
    cout << "\n=== Commands ===" << endl;
    cout << left;
    cout << setw(25) << CMD_PREFIX "add" << "Add " << ENTITY_SINGULAR << " interactively" << endl;
    cout << setw(25) << CMD_PREFIX "list" << "List all " << ENTITY_PLURAL << endl;
    cout << setw(25) << CMD_PREFIX "search" << "Search " << ENTITY_SINGULAR << endl;
    cout << setw(25) << CMD_PREFIX "edit" << "Edit " << ENTITY_SINGULAR << endl;
    cout << setw(25) << CMD_PREFIX "delete" << "Delete " << ENTITY_SINGULAR << endl;
    cout << setw(25) << CMD_PREFIX "sort <0-3>" << "Sort (0=ID,1=Name,2=Qty,3=Date)" << endl;
#if ENABLE_GRAPH
    cout << setw(25) << "connect" << "Add " << RELATION_NAME << endl;
    cout << setw(25) << "weight" << "Set " << RELATION_NAME << " weight" << endl;
    cout << setw(25) << "adj" << "Show adjacency matrix" << endl;
    cout << setw(25) << "weights" << "Show weight matrix" << endl;
    cout << setw(25) << "links <id>" << "Show " << RELATION_NAME << "s for " << ENTITY_SINGULAR << endl;
#endif
    cout << setw(25) << "save" << "Save to files" << endl;
    cout << setw(25) << "load" << "Load from files" << endl;
    cout << setw(25) << "help" << "Show this help" << endl;
    cout << setw(25) << "exit" << "Exit program" << endl;
}
#endif

// ===========================================================================
// COMMAND MODE - Text-based command interface (no need to modify)
// ===========================================================================
#ifdef USE_COMMAND_MODE

// Parse and execute user command
bool processCommand(const string& input) {
    string cmd = toLower(trim(input));
    if (cmd.empty()) return true;
    
    // Parse command and args
    stringstream ss(cmd);
    string c; ss >> c;
    
    if (c == "exit" || c == "quit" || c == "q") return false;
    if (c == "help" || c == "?") { showHelp(); return true; }
    
    if (c == CMD_PREFIX "add" || c == "add") { addItemInteractive(); return true; }
    if (c == CMD_PREFIX "list" || c == "list" || c == "ls") { listItems(); return true; }
    if (c == CMD_PREFIX "search" || c == "search" || c == "find") { searchInteractive(); return true; }
    if (c == CMD_PREFIX "edit" || c == "edit") { editInteractive(); return true; }
    if (c == CMD_PREFIX "delete" || c == "delete" || c == "del" || c == "rm") { deleteInteractive(); return true; }
    
    if (c == CMD_PREFIX "sort" || c == "sort") {
        int f = DEFAULT_SORT_FIELD;
        ss >> f;
        sortItems(f);
        listItems();
        return true;
    }
    
#if ENABLE_GRAPH
    if (c == "connect" || c == "link") { addConnectionInteractive(); return true; }
    if (c == "weight" || c == "setweight") { setWeightInteractive(); return true; }
    if (c == "adj" || c == "adjmatrix" || c == "matrix") { displayAdjMatrix(); return true; }
    if (c == "weights" || c == "weightmatrix") { displayWeightMatrix(); return true; }
    if (c == "links" || c == "connections") {
        int id; ss >> id;
        if (id > 0) listConnections(id);
        else { cout << FIELD_ID << ": "; cin >> id; clearInput(); listConnections(id); }
        return true;
    }
#endif
    
    if (c == "save") { saveAll(); return true; }
    if (c == "load") { loadAll(); return true; }
    
    cerr << "Unknown command: " << c << ". Type 'help' for commands." << endl;
    return true;
}

void runCommandMode() {
    cout << "\n========================================" << endl;
    cout << "  " << ENTITY_SINGULAR << " Management System" << endl;
    cout << "  (Command Mode - type 'help')" << endl;
    cout << "========================================" << endl;
    
    string input;
    while (true) {
        cout << "\n> ";
        if (!getline(cin, input)) break;
        if (!processCommand(input)) break;
    }
    cout << "Goodbye!" << endl;
}
#endif

// ===========================================================================
// MENU MODE - Numbered menu interface (no need to modify)
// ===========================================================================
#ifdef USE_MENU_MODE

// Display main menu
void showMenu() {
    cout << "\n========================================" << endl;
    cout << "  " << ENTITY_SINGULAR << " Management System" << endl;
    cout << "========================================" << endl;
    cout << "1. Add " << ENTITY_SINGULAR << endl;
    cout << "2. List " << ENTITY_PLURAL << endl;
    cout << "3. Search " << ENTITY_SINGULAR << endl;
    cout << "4. Edit " << ENTITY_SINGULAR << endl;
    cout << "5. Delete " << ENTITY_SINGULAR << endl;
#if ENABLE_GRAPH
    cout << "6. Add " << RELATION_NAME << endl;
    cout << "7. Set Weight" << endl;
    cout << "8. Show Matrices" << endl;
#endif
    cout << "9. Save/Load" << endl;
    cout << "0. Exit" << endl;
    cout << "----------------------------------------" << endl;
    cout << "Choice: ";
}

#if ENABLE_GRAPH
void matrixSubMenu() {
    cout << "\n1.Adjacency 2.Weights 3.Both 4.Links 0.Back: ";
    int c; cin >> c; clearInput();
    if (c == 1) displayAdjMatrix();
    else if (c == 2) displayWeightMatrix();
    else if (c == 3) { displayAdjMatrix(); displayWeightMatrix(); }
    else if (c == 4) {
        cout << FIELD_ID << ": "; int id; cin >> id; clearInput();
        listConnections(id);
    }
}
#endif

void saveLoadSubMenu() {
    cout << "\n1.Save All 2.Load All 0.Back: ";
    int c; cin >> c; clearInput();
    if (c == 1) saveAll();
    else if (c == 2) loadAll();
}

void runMenuMode() {
    int choice;
    do {
        showMenu();
        if (!(cin >> choice)) { clearInput(); continue; }
        clearInput();
        
        switch (choice) {
            case 1: addItemInteractive(); break;
            case 2: listItems(); break;
            case 3: searchInteractive(); break;
            case 4: editInteractive(); break;
            case 5: deleteInteractive(); break;
#if ENABLE_GRAPH
            case 6: addConnectionInteractive(); break;
            case 7: setWeightInteractive(); break;
            case 8: matrixSubMenu(); break;
#endif
            case 9: saveLoadSubMenu(); break;
            case 0: cout << "Goodbye!" << endl; break;
            default: cout << "Invalid choice." << endl;
        }
    } while (choice != 0);
}
#endif

// ===========================================================================
// MAIN - Entry point (no need to modify)
// ===========================================================================
int main() {
#if ENABLE_GRAPH
    initGraph();           // Initialize adjacency matrices
#endif
    loadAll();             // Load data from files (if exist)
    seedData();            // Add sample data (if SEED_ON_START=true)
    
#ifdef USE_COMMAND_MODE
    runCommandMode();      // Start command-line interface
#endif

#ifdef USE_MENU_MODE
    runMenuMode();         // Start menu interface
#endif

    return 0;
}
