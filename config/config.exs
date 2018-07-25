# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :voice_chat,
  ecto_repos: [VoiceChat.Repo]

# Configures the endpoint
config :voice_chat, VoiceChatWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "NG4QtLkuyqqTmfnuwWaZATjkK0fj4ytlKTN+oQGw7JN+A5oz/ppfs7LsPDgvz6RP",
  render_errors: [view: VoiceChatWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: VoiceChat.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:user_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
