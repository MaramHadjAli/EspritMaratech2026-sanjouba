/**
 * OMNIA - Comprehensive Type Definitions
 * All types used across the frontend application
 */
// ============================================
// USER & AUTHENTICATION TYPES
// ============================================
export var UserRole;
(function (UserRole) {
    UserRole["GUEST"] = "GUEST";
    UserRole["USER"] = "USER";
    UserRole["EMPLOYEE"] = "EMPLOYEE";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
// ============================================
// FAMILY TYPES
// ============================================
export var SocioeconomicStatus;
(function (SocioeconomicStatus) {
    SocioeconomicStatus["VERY_VULNERABLE"] = "very_vulnerable";
    SocioeconomicStatus["VULNERABLE"] = "vulnerable";
    SocioeconomicStatus["STABLE"] = "stable";
})(SocioeconomicStatus || (SocioeconomicStatus = {}));
export var FamilyStatus;
(function (FamilyStatus) {
    FamilyStatus["ACTIVE"] = "active";
    FamilyStatus["INACTIVE"] = "inactive";
    FamilyStatus["ARCHIVED"] = "archived";
})(FamilyStatus || (FamilyStatus = {}));
// ============================================
// CAMPAIGN & VISIT TYPES
// ============================================
export var CampaignType;
(function (CampaignType) {
    CampaignType["FOOD_DISTRIBUTION"] = "food_distribution";
    CampaignType["MEDICAL_VISIT"] = "medical_visit";
    CampaignType["SPECIALIZED_AID"] = "specialized_aid";
    CampaignType["OTHER"] = "other";
})(CampaignType || (CampaignType = {}));
// ============================================
// AID TYPES
// ============================================
export var AidType;
(function (AidType) {
    AidType["FOOD_PACKAGE"] = "food_package";
    AidType["FOOD"] = "FOOD";
    AidType["MEDICINE"] = "medicine";
    AidType["CLOTHING"] = "clothing";
    AidType["MEDICAL_VISIT"] = "medical_visit";
    AidType["FUEL"] = "fuel";
    AidType["OTHER"] = "other";
})(AidType || (AidType = {}));
//# sourceMappingURL=index.js.map