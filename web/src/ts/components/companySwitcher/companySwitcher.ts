import $ from 'jquery';

const switcher = $('#company-switcher');

export function initCompanySwitcher() {
    const selectedVal = localStorage.getItem('selectedCompany');

	$.ajax({
		url: "http://167.99.129.124:1242/api/companies",
		method: "GET",
		success: function (data) {
			const $select = $("#company-switcher");
			$select.empty();
			$.each(data, function (index, company) {
				$select.append(
					$("<option>").val(company.id).text(company.name)
				);
			});
			if (selectedVal) {
				$select.val(selectedVal);
			} else if (data.length > 0) {
				$select.val(data[0].id);
				localStorage.setItem("selectedCompany", data[0].id);
			}
			$select.on("change", function () {
				const selectedCompanyId = $(this).val();
				if (selectedCompanyId === undefined) return;
				localStorage.setItem("selectedCompany", `${selectedCompanyId}`);
				location.reload();
			});
		},
		error: function () {
			console.error("Failed to load companies");
		},
	});
}

export function getSelectedCompanyId(): number | null {
    const selectedVal = localStorage.getItem('selectedCompany');
    if (!selectedVal) return null;
    const parsed = parseInt(selectedVal, 10);
    if (isNaN(parsed)) return null;
    return parsed;
}

initCompanySwitcher();