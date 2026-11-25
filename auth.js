import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from "./supabase-config.js";

const authToggles = document.querySelectorAll("[data-auth-toggle]");
const authDialog = document.querySelector("#auth-dialog");
const authClose = document.querySelector("#auth-close");
const authForm = document.querySelector("#auth-form");
const authTabs = document.querySelector("#auth-tabs");
const authEmail = document.querySelector("#auth-email");
const authPassword = document.querySelector("#auth-password");
const passwordLabel = document.querySelector("#password-label");
const authForgot = document.querySelector("#auth-forgot");
const authMessage = document.querySelector("#auth-message");
const authSubmit = document.querySelector("#auth-submit");
const authTitle = document.querySelector("#auth-title");
const isConfigured = SUPABASE_URL.startsWith("https://")
  && !SUPABASE_URL.includes("YOUR_PROJECT_ID")
  && SUPABASE_PUBLIC_KEY.length > 20
  && !SUPABASE_PUBLIC_KEY.includes("YOUR_");
const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY) : null;
let authMode = "signin";
let currentSession = null;

function showMessage(message, kind = "info") {
  authMessage.textContent = message;
  authMessage.dataset.kind = kind;
}

function setAuthMode(mode) {
  authMode = mode;
  const isUpdate = mode === "update";
  authTabs.hidden = isUpdate;
  authForgot.hidden = mode !== "signin";
  passwordLabel.textContent = isUpdate ? "New password" : "Password";
  authPassword.autocomplete = mode === "signin" ? "current-password" : "new-password";
  authPassword.value = "";
  authTitle.textContent = isUpdate
    ? "Set a new password"
    : mode === "signup" ? "Create your account" : "Welcome back";
  authSubmit.textContent = isUpdate
    ? "Update password"
    : mode === "signup" ? "Create account" : "Sign in";

  document.querySelectorAll("[data-auth-mode]").forEach((tab) => {
    const isActive = tab.dataset.authMode === mode;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  showMessage("");
}

function updateAuthToggle(session) {
  currentSession = session;
  const email = session?.user?.email;
  authToggles.forEach((authToggle) => {
    authToggle.textContent = email ? "Sign out" : "Sign in";
    authToggle.setAttribute("aria-label", email ? `Sign out ${email}` : "Sign in");
    authToggle.title = email ? `Signed in as ${email}` : "Sign in";
  });
}

function showConfigurationMessage() {
  showMessage("Add your Supabase project URL and publishable/anon key to supabase-config.js to enable accounts.", "error");
}

async function handleSubmit(event) {
  event.preventDefault();
  if (!supabase) {
    showConfigurationMessage();
    return;
  }

  authSubmit.disabled = true;
  showMessage("Please wait...");

  try {
    if (authMode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: authEmail.value.trim(),
        password: authPassword.value,
        options: { emailRedirectTo: `${window.location.origin}${window.location.pathname}` }
      });
      if (error) throw error;
      if (data.session) {
        showMessage("Your account is ready.", "success");
        authDialog.close();
      } else {
        showMessage("Check your inbox to confirm your email and finish creating your account.", "success");
      }
      return;
    }

    if (authMode === "update") {
      const { error } = await supabase.auth.updateUser({ password: authPassword.value });
      if (error) throw error;
      showMessage("Your password has been updated.", "success");
      authDialog.close();
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail.value.trim(),
      password: authPassword.value
    });
    if (error) throw error;
    showMessage("You are signed in.", "success");
    authDialog.close();
  } catch (error) {
    showMessage(error.message || "Authentication failed. Please try again.", "error");
  } finally {
    authSubmit.disabled = false;
  }
}

document.querySelectorAll("[data-auth-mode]").forEach((tab) => {
  tab.addEventListener("click", () => setAuthMode(tab.dataset.authMode));
});

authToggles.forEach((authToggle) => {
  authToggle.addEventListener("click", async () => {
    if (!currentSession) {
      setAuthMode("signin");
      authDialog.showModal();
      if (!isConfigured) showConfigurationMessage();
      return;
    }

    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) showMessage(error.message, "error");
  });
});

authClose.addEventListener("click", () => authDialog.close());
authForm.addEventListener("submit", handleSubmit);
authForgot.addEventListener("click", async () => {
  if (!supabase) {
    showConfigurationMessage();
    return;
  }
  if (!authEmail.reportValidity()) return;

  authForgot.disabled = true;
  showMessage("Sending password reset email...");
  const { error } = await supabase.auth.resetPasswordForEmail(authEmail.value.trim(), {
    redirectTo: `${window.location.origin}${window.location.pathname}`
  });
  authForgot.disabled = false;
  showMessage(error ? error.message : "If an account exists for this address, a password reset email is on its way.", error ? "error" : "success");
});

authDialog.addEventListener("click", (event) => {
  if (event.target === authDialog) authDialog.close();
});
authDialog.addEventListener("close", () => {
  if (authMode !== "update") setAuthMode("signin");
});

if (supabase) {
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) showMessage(error.message, "error");
    updateAuthToggle(data?.session ?? null);
  });

  supabase.auth.onAuthStateChange((event, session) => {
    updateAuthToggle(session);
    if (event === "PASSWORD_RECOVERY") {
      setAuthMode("update");
      authDialog.showModal();
    }
  });
}
