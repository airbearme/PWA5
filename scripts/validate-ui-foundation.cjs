#!/usr/bin/env node
const { readFileSync, existsSync } = require("fs");
const { join } = require("path");
const PROJECT_ROOT = process.cwd();
console.log("🎨 Validating Core UI/UX Foundation...\n");
const errors = [];
const REQUIRED_KEYFRAMES = ["pulse-glow", "float", "shimmer", "particle", "rickshaw-bounce", "wheel-spin", "neon-glow", "holographic-shift", "plasma-flow", "solar-rays", "eco-breeze", "god-rays"];
const REQUIRED_UTILITY_CLASSES = ["animate-pulse-glow", "animate-float", "animate-shimmer", "animate-particle", "animate-rickshaw-bounce", "animate-wheel-spin", "animate-neon-glow", "animate-holographic", "animate-plasma", "animate-solar-rays", "animate-eco-breeze", "animate-god-rays"];
const REQUIRED_COMPONENT_CLASSES = ["hover-lift", "glass-morphism", "ripple-effect", "airbear-holographic", "airbear-plasma", "airbear-solar-rays", "airbear-eco-breeze", "airbear-god-rays", "eco-gradient"];

function checkFile(filePath, checks) {
    try {
        if (!existsSync(filePath)) {
            errors.push(filePath + ": File not found");
            return;
        }
        const content = readFileSync(filePath, "utf-8");
        checks.forEach((check) => {
            if (!check.pattern.test(content)) {
                errors.push(filePath + ": " + check.name + " MISSING");
            }
        });
    } catch (error) {
        errors.push(filePath + ": Error: " + error.message);
    }
}

checkFile(join(PROJECT_ROOT, "app", "globals.css"), [
    ...REQUIRED_KEYFRAMES.map((name) => ({ name: "@keyframes " + name, pattern: new RegExp("@keyframes\\s+" + name) })),
    ...REQUIRED_UTILITY_CLASSES.map((name) => ({ name: "." + name, pattern: new RegExp("\\." + name) })),
    ...REQUIRED_COMPONENT_CLASSES.map((name) => ({ name: "." + name, pattern: new RegExp("\\." + name) }))
]);

if (errors.length === 0) {
    console.log("✅ All core UI/UX features are present!");
    process.exit(0);
} else {
    console.log("❌ " + errors.length + " errors found.");
    errors.forEach(e => console.log("  " + e));
    process.exit(1);
}
