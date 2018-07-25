defmodule VoiceChatWeb.PageController do
  use VoiceChatWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
