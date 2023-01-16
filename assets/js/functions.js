/* Validate numerical input. */
function val_num(e)
{
	if (e.key >= "0" && e.key <= "9")
		return true;
	return true; 
}

/* Populate rice options. */
function populate_rice()
{
	_populate_rice_helper("/assets/json/wmdes.json", "#s_wmde");
	_populate_rice_helper("/assets/json/greeters.json", "#s_greeter");
	_populate_rice_helper("/assets/json/compositors.json", "#s_compositor");
	_populate_rice_helper("/assets/json/app_launchers.json", "#s_app_launcher");
	_populate_rice_helper("/assets/json/status_bars.json", "#s_status_bar");
	_populate_rice_helper("/assets/json/terminals.json", "#s_terminal");
	_populate_rice_helper("/assets/json/editors.json", "#s_editor");
	_populate_rice_helper("/assets/json/lockscreens.json", "#s_lockscreen");
	_populate_rice_helper("/assets/json/wallpapers.json", "#s_wallpaper");
	_populate_rice_helper("/assets/json/browsers.json", "#s_browser");
}

/* Helper function for populate_rice. */
function _populate_rice_helper(jsonPath, target)
{
	$.getJSON(jsonPath, function(data)
	{
		$.each(data, function(i, item)
		{
			$(target).append($("<option></option>").val(item.package).html(item.name));
		});
	});
}

/* Handle a rice "none" config. Give it the toggle ID, config ID, and script ID. */
function handle_none(object, toggle, config, script)
{
	if ($(object).val() == "none")
	{
		$(toggle).addClass("disabled");
		$(config).attr("disabled", true);
		$(config).val("").change();
		$(script).attr("disabled", true);
		$(script).prop("checked", false);
	}
	else
	{
		$(toggle).removeClass("disabled");
		$(config).attr("disabled", false);
		$(script).attr("disabled", false);
	}
}