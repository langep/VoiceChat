defmodule VoiceChatWeb.RoomChannel do
    use VoiceChatWeb, :channel

    alias VoiceChatWeb.Presence

    def join("rooms:lobby", _, socket) do
        send self(), :after_join
        {:ok, socket}     
    end

    def handle_info(:after_join, socket) do
        Presence.track(socket, socket.assigns.user_id, %{})
        push socket, "presence_state", Presence.list(socket)
        {:noreply, socket}
    end

    def handle_in(name, payload, socket) do
        case name do 
            "comment:add" -> 
                %{"content" => content} = payload
                broadcast!(socket, "comment:new", %{user_id: socket.assigns.user_id, content: content})
                {:reply, :ok, socket}
            "initiate:" <> user_id -> 
                broadcast_from!(socket, name, payload)
                {:reply, :ok, socket}
            "signal:" <> user_id -> 
                broadcast_from!(socket, name, payload)
                {:reply, :ok, socket}
        end

    end
end