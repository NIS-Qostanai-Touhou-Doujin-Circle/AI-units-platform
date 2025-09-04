import $ from "jquery";
import { WAZZUP_API_URL } from "../../config";
import { getSelectedCompanyId } from "./companySwitcher";

const switcher = $("#user-switcher");

export function initUserSwitcher() {
    const selectedVal = localStorage.getItem("selectedUser");
    const companyId = getSelectedCompanyId();
    if (!companyId) {
        console.error("No company selected");
        return;
    }
    $.ajax({
        url: `${WAZZUP_API_URL}/users/${companyId}`,
        method: "GET",
        success: function (data) {
            const $select = $("#user-switcher");
            $select.empty();
            $.each(data, function (index, user) {
                $select.append($("<option>").val(user.id).text(user.name));
            });
            if (selectedVal) {
                $select.val(selectedVal);
            } else if (data.length > 0) {
                $select.val(data[0].id);
                localStorage.setItem("selectedUser", data[0].id);
            }
            $select.on("change", function () {
                const selectedUserId = $(this).val();
                if (selectedUserId === undefined) return;
                localStorage.setItem("selectedUser", `${selectedUserId}`);
                location.reload();
            });
        },
        error: function () {
            console.error("Failed to load users");
        },
    });
}

export function getSelectedUserId(): number | null {
    const selectedVal = localStorage.getItem("selectedUser");
    if (!selectedVal) return null;
    const parsed = parseInt(selectedVal, 10);
    if (isNaN(parsed)) return null;
    return parsed;
}

// Don't call init here, because the company switcher must be initialized first
// The company switcher will call initUserSwitcher after initialization