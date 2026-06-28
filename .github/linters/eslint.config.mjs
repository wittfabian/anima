// Flat ESLint config for the ANIMA cabinet.
// Lints the standalone scripts (anima-nav.js, service-worker.js) AND the
// inline <script> blocks inside each world's index.html (via eslint-plugin-html).
//
// Philosophy: the exhibits are intentionally dense, hand-tuned vanilla JS.
// We do NOT enforce a style here — we only catch real, high-signal mistakes
// (typos / undefined refs, duplicate keys, unreachable code, broken typeof,
// accidental assignments in conditions). Stylistic rules stay off so the
// existing terse code passes and authors keep their voice.
import html from "eslint-plugin-html";
import globals from "globals";

export default [
  {
    files: ["**/*.js", "**/*.html"],
    plugins: { html },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
        // Safari-prefixed Web Audio constructor used by resonance.
        webkitAudioContext: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
      "no-dupe-keys": "error",
      "no-dupe-args": "error",
      "no-duplicate-case": "error",
      "no-redeclare": "error",
      "no-unreachable": "error",
      "no-func-assign": "error",
      "no-cond-assign": ["error", "always"],
      "no-unsafe-negation": "error",
      "use-isnan": "error",
      "valid-typeof": "error",
      "no-self-compare": "error",
      "no-constant-binary-expression": "error",
      // Unused symbols are worth surfacing, but never block a merge over the
      // exhibits' throwaway loop/handler vars — warn only, ignore _-prefixed.
      "no-unused-vars": [
        "warn",
        { args: "none", varsIgnorePattern: "^_", caughtErrors: "none" },
      ],
    },
  },
  {
    // The deploy root is published as-is; nothing to lint outside our sources.
    ignores: ["fonts/**"],
  },
];
