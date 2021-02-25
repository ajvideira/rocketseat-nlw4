defmodule RocketpayWeb.UsersView do
  alias Rocketpay.User

  def render("create.json", %{user: %User{id: id, name: name, email: email, nickname: nickname}}) do
    %{
      message: "User created",
      user: %{
        id: id,
        name: name,
        email: email,
        nickname: nickname
      }
    }
  end
end
