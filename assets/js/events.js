/* From: /assets/json/presets_locality.json */
var presetsLocality = {};
var homePartitionSizeBuffer = "";
var helpItem = "";

/* Populate options from JSON. */
$(document).ready(function()
{
	/* Populate locality presets. */
	$.getJSON("/assets/json/presets_locality.json", function(data)
	{
		presetsLocality = data;
		$.each(data, function(i, item)
		{
			$("#preset_locality").append($("<option></option>").val(item.name).html(item.name));
		});
	});

	/* Populate timezone options. */
	$.getJSON("/assets/json/timezones.json", function(data)
	{
		$.each(data, function(i, item)
		{
			$("#s_timezone").append($("<option></option>").val(item).html(item));
		});
	});

	/* Populate locale options. */
	$.getJSON("/assets/json/locales.json", function(data)
	{
		$.each(data, function(i, item)
		{
			$("#s_locale").append($("<option></option>").val(item).html(item));
		});
	});

	populate_rice();
});

/* Handle locality presetting. */
$("#preset_locality").change(function()
{
	if ($(this).val() != "Custom")
	{
		var preset = presetsLocality.filter(obj => { return obj.name == $(this).val() })[0];
		$("#s_timezone").val(preset.timezone).change();
		$("#s_locale").val(preset.locale).change();
		$("#s_timezone").attr("disabled", true);
		$("#s_locale").attr("disabled", true);
		$("#locality-toggle").addClass("disabled");
	}
	else
	{
		$("#s_timezone").attr("disabled", false);
		$("#s_locale").attr("disabled", false);
		$("#locality-toggle").removeClass("disabled");
	}
});

/* Handle partition size presetting. */
$("#preset_partitions_recommended").click(function()
{
	$("#preset_disk_size").attr("disabled", false);
	$("#s_size_boot").attr("disabled", true);
	$("#s_size_swap").attr("disabled", true);
	$("#s_size_root").attr("disabled", true);
	$("#home_remainder").attr("disabled", true);
	$("#s_size_home").attr("disabled", true);

	$("#home_remainder").prop("checked", true);
	homePartitionSizeBuffer = $("#s_size_home").val();
	$("#s_size_home").val("").change();

	$("#disk-toggle-1").removeClass("disabled");
	$("#disk-toggle-2").addClass("disabled");
});
$("#preset_partitions_custom").click(function()
{
	$("#preset_disk_size").val("").change();
	$("#preset_disk_size").attr("disabled", true);
	$("#s_size_boot").attr("disabled", false);
	$("#s_size_swap").attr("disabled", false);
	$("#s_size_root").attr("disabled", false);
	$("#home_remainder").attr("disabled", false);
	if ($("#home_remainder").is(":checked"))
		$("#s_size_home").attr("disabled", true);
	else
		$("#s_size_home").attr("disabled", false);

	$("#disk-toggle-1").addClass("disabled");
	$("#disk-toggle-2").removeClass("disabled");
});
$("#home_remainder").click(function()
{
	if ($(this).is(":checked"))
	{
		homePartitionSizeBuffer = $("#s_size_home").val();
		$("#s_size_home").val("").change();
		$("#s_size_home").attr("disabled", true);
	}
	else
	{
		$("#s_size_home").val(homePartitionSizeBuffer).change();
		$("#s_size_home").attr("disabled", false);
	}
});
$("#preset_disk_size").on("input", function()
{
	let value = $(this).val();
	if (value < 16)
	{
		$("#s_size_boot").val("").change();
		$("#s_size_swap").val("").change();
		$("#s_size_root").val("").change();
	}
	else if (value < 32)
	{
		$("#s_size_boot").val("512").change();
		$("#s_size_swap").val("1").change();
		$("#s_size_root").val("8").change();
	}
	else if (value < 64)
	{
		$("#s_size_boot").val("512").change();
		$("#s_size_swap").val("1").change();
		$("#s_size_root").val("16").change();
	}
	else if (value < 128)
	{
		$("#s_size_boot").val("512").change();
		$("#s_size_swap").val("1").change();
		$("#s_size_root").val("32").change();
	}
	else
	{
		$("#s_size_boot").val("512").change();
		$("#s_size_swap").val("1").change();
		$("#s_size_root").val("64").change();
	}
});

/* Handle driver type option based on display selection. */
$("#s_display_intel").click(function()
{
	$("#s_driver_open").attr("disabled", false);
	$("#s_driver_proprietary").attr("disabled", true);
	$("#s_driver_open").prop("checked", true);

	$("#drivers-toggle").addClass("disabled");
});
$("#s_display_amd").click(function()
{
	$("#s_driver_open").attr("disabled", false);
	$("#s_driver_proprietary").attr("disabled", false);

	if (!($("#s_driver_open").is(":checked") || $("#s_driver_proprietary").is(":checked")))
		$("#s_driver_open").prop("checked", true);

	$("#drivers-toggle").removeClass("disabled");
});
$("#s_display_nvidia").click(function()
{
	$("#s_driver_open").attr("disabled", false);
	$("#s_driver_proprietary").attr("disabled", false);

	if (!($("#s_driver_open").is(":checked") || $("#s_driver_proprietary").is(":checked")))
		$("#s_driver_open").prop("checked", true);

	$("#drivers-toggle").removeClass("disabled");
});
$("#s_display_none").click(function()
{
	$("#s_driver_open").attr("disabled", true);
	$("#s_driver_proprietary").attr("disabled", true);
	$("#s_driver_open").prop("checked", false);
	$("#s_driver_proprietary").prop("checked", false);

	$("#drivers-toggle").addClass("disabled");
});

/* Help menu. */
$(".help").click(function(e)
{
	if (helpItem == this.parentElement.htmlFor)
	{
		$("#help-menu").fadeOut("slow", function() { $("#help-menu").addClass("hidden") });
		helpItem = "";
	}
	else
	{
		if ($("#help-menu").hasClass("hidden"))
		{
			$("#help-menu").css("top", e.pageY - 64);
			$("#help-menu").fadeIn("slow");
			$("#help-menu").removeClass("hidden");
		}
		else
		{
			$("#help-menu").animate({top: e.pageY-64});
		}

		helpItem = this.parentElement.htmlFor;
		$("#help-menu-bar-title").text("Help: "+this.parentElement.textContent.slice(0, -4));

		$("#help-menu-body").load("/assets/html/help/"+helpItem+".html");
	}
});
$("#help-menu-bar-close").click(function()
{
	$("#help-menu").fadeOut("slow", function() { $("#help-menu").addClass("hidden") });
	helpItem = "";
});

/* Handle None rice configs. */
$("#s_wmde").change(function()
{
	handle_none(this, "#wmde-toggle", "#s_wmde_config", "#s_wmde_config_script");
});
$("#s_greeter").change(function()
{
	handle_none(this, "#greeter-toggle", "#s_greeter_config", "#s_greeter_config_script");
});
$("#s_compositor").change(function()
{
	handle_none(this, "#compositor-toggle", "#s_compositor_config", "#s_compositor_config_script");
});
$("#s_app_launcher").change(function()
{
	handle_none(this, "#app_launcher-toggle", "#s_app_launcher_config", "#s_app_launcher_config_script");
});
$("#s_status_bar").change(function()
{
	handle_none(this, "#status_bar-toggle", "#s_status_bar_config", "#s_status_bar_config_script");
});
$("#s_terminal").change(function()
{
	handle_none(this, "#terminal-toggle", "#s_terminal_config", "#s_terminal_config_script");
});
$("#s_editor").change(function()
{
	handle_none(this, "#editor-toggle", "#s_editor_config", "#s_editor_config_script");
});
$("#s_lockscreen").change(function()
{
	handle_none(this, "#lockscreen-toggle", "#s_lockscreen_config", "#s_lockscreen_config_script");
});
$("#s_wallpaper").change(function()
{
	handle_none(this, "#wallpaper-toggle", "#s_wallpaper_config", "#s_wallpaper_config_script");
});
$("#s_browser").change(function()
{
	handle_none(this, "#browser-toggle", "#s_browser_config", "#s_browser_config_script");
});
