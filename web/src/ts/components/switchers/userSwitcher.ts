import $ from "jquery";

const switcher = $("#user-switcher");

export function initUserSwitcher() {
    const selectedVal = localStorage.getItem("selectedUser");

    $.ajax({
        url: "http://
}