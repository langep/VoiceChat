defmodule VoiceChatWeb.PageControllerTest do
  use VoiceChatWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get conn, "/"
    assert html_response(conn, 200) =~ "VoiceChat"
  end
end
