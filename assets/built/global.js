"use strict";
for (var changeAnchorToButton = function(e) {
        var t = document.createElement("button");
        t.setAttribute("type", "button"), t.innerHTML = e.innerHTML, e.id && (t.id = e.id);
        for (var o = 0; o < e.classList.length; o++) t.classList.add(e.classList[o]);
        e.parentNode.replaceChild(t, e)
    }, anchorButtons = document.getElementsByClassName("anchorButton"), i = 0; i < anchorButtons.length; i++) changeAnchorToButton(anchorButtons[i]);

function Dialog(e, t, o, s) {
    this.dialogEl = e, this.overlayEl = t, this.focusedElBeforeOpen;
    var n = this.dialogEl.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
    this.focusableEls = Array.prototype.slice.call(n), this.firstFocusableEl = this.focusableEls[0], this.lastFocusableEl = this.focusableEls[this.focusableEls.length - 1], this.addEventListeners(o, s), this.close()
}
Dialog.prototype.open = function() {
    var t = this;
    this.dialogEl.removeAttribute("aria-hidden"), this.overlayEl.removeAttribute("aria-hidden"), this.focusedElBeforeOpen = document.activeElement, this.dialogEl.addEventListener("keydown", function(e) {
        t.handleKeyDown(e)
    }), this.overlayEl.addEventListener("click", function() {
        t.close()
    }), this.firstFocusableEl.focus()
}, Dialog.prototype.close = function() {
    this.dialogEl.setAttribute("aria-hidden", !0), this.overlayEl.setAttribute("aria-hidden", !0), this.focusedElBeforeOpen && this.focusedElBeforeOpen.focus()
}, Dialog.prototype.handleKeyDown = function(e) {
    var t = this;
    switch (e.keyCode) {
        case 9:
            if (1 === t.focusableEls.length) return void e.preventDefault();
            e.shiftKey ? document.activeElement === t.firstFocusableEl && (e.preventDefault(), t.lastFocusableEl.focus()) : document.activeElement === t.lastFocusableEl && (e.preventDefault(), t.firstFocusableEl.focus());
            break;
        case 27:
            t.close()
    }
}, Dialog.prototype.addEventListeners = function(e, t) {
    for (var o = this, s = document.querySelectorAll(e), n = 0; n < s.length; n++) s[n].addEventListener("click", function() {
        o.open()
    });
    var a = document.querySelectorAll(t);
    for (n = 0; n < a.length; n++) a[n].addEventListener("click", function() {
        o.close()
    })
};
var dialogOverlay = document.querySelector(".dialog-overlay"),
    navDialogEl = document.querySelector(".dialog--nav");
new Dialog(navDialogEl, dialogOverlay, ".site__nav__open", ".site__nav__close");
var consoleMessages = ["Hi there :)", "👀 I 👀 see 👀 you 👀", "Hope you're having a great day 😊", "How do you comfort a JavaScript bug? You console it 😎"],
    consoleMessage = consoleMessages[Math.floor(Math.random() * consoleMessages.length)];
console.log(consoleMessage), "serviceWorker" in navigator && window.addEventListener("load", function() {
    navigator.serviceWorker.register("httsp://cdn.nafcodes.com/sw.js?refresh=true", {
        scope: "/"
    }).then(function(e) {
        console.log("Yay service worker registered!"), e.waiting && e.update()
    }).catch(function(e) {
        return console.log("Boo, service worker not registered:(", e)
    })
});