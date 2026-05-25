/**
 * =============================================================================
 * DSA PRACTICAL EXAM TEMPLATE - CONFIGURATION FILE
 * =============================================================================
 * 
 * HOW TO ADAPT TO A NEW EXAM SCENARIO:
 * ------------------------------------
 * 1. Change ENTITY_NAME_SINGULAR and ENTITY_NAME_PLURAL (e.g., "City", "Cities")
 * 2. Change RELATION_NAME (e.g., "Road", "Connection", "Friendship")
 * 3. Update file names (ENTITIES_FILE, RELATIONS_FILE, WEIGHTS_FILE)
 * 4. Modify FIELD_* names to match your scenario
 * 5. Adjust MAX_ENTITIES if needed
 * 6. Choose interaction style: USE_COMMAND_STYLE or USE_MENU_STYLE
 * 
 * COMMON SCENARIOS:
 * - Inventory Management: Item, Items, Dependency
 * - Road Network: City, Cities, Road
 * - Student Records: Student, Students, Friendship
 * - Task Management: Task, Tasks, Dependency
 * =============================================================================
 */

#ifndef CONFIG_H
#define CONFIG_H

#include <string>

// =============================================================================
// INTERACTION STYLE - Uncomment ONE of these
// =============================================================================
#define USE_COMMAND_STYLE  // Command-line style: itemadd, itemslist, help, exit
// #define USE_MENU_STYLE  // Menu style: numbered options 1-9

// =============================================================================
// ENTITY CONFIGURATION
// =============================================================================
#define ENTITY_NAME_SINGULAR "Item"
#define ENTITY_NAME_PLURAL   "Items"
#define RELATION_NAME        "Connection"  // e.g., "Road", "Dependency", "Link"

// Command prefix for command-line style (lowercase)
#define COMMAND_PREFIX       "item"  // Commands: itemadd, itemslist, itemsearch, etc.

// =============================================================================
// FIELD NAMES (for display and prompts)
// =============================================================================
#define FIELD_ID             "ID"
#define FIELD_NAME           "Name"
#define FIELD_QUANTITY       "Quantity"    // Can be: "Budget", "Population", "Score"
#define FIELD_DATE           "Date"        // Can be: "Registration Date", "Created"

// =============================================================================
// LIMITS AND SIZES
// =============================================================================
#define MAX_ENTITIES         100
#define MAX_NAME_LENGTH      50
#define MAX_COMMAND_LENGTH   256

// =============================================================================
// FILE NAMES
// =============================================================================
#define ENTITIES_FILE        "items.csv"
#define RELATIONS_FILE       "connections.txt"
#define WEIGHTS_FILE         "weights.txt"

// =============================================================================
// SORTING CONFIGURATION
// =============================================================================
// Sort field: 0 = ID, 1 = Name, 2 = Quantity, 3 = Date
#define DEFAULT_SORT_FIELD   0
#define SORT_ASCENDING       true

// =============================================================================
// VALIDATION RULES
// =============================================================================
#define MIN_ID               1
#define MAX_ID               9999
#define MIN_QUANTITY         0
#define MAX_QUANTITY         1000000
#define DATE_FORMAT          "YYYY-MM-DD"

// =============================================================================
// DISPLAY SETTINGS
// =============================================================================
#define COL_WIDTH_ID         8
#define COL_WIDTH_NAME       25
#define COL_WIDTH_QUANTITY   12
#define COL_WIDTH_DATE       15
#define MATRIX_CELL_WIDTH    4

// =============================================================================
// GRAPH SETTINGS
// =============================================================================
#define NO_CONNECTION        0
#define DEFAULT_WEIGHT       1
#define NO_WEIGHT            -1

#endif // CONFIG_H
