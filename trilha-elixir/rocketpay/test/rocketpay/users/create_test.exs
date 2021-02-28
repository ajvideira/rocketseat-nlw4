defmodule Rocketpay.Users.CreateTest do
  use Rocketpay.DataCase, async: true

  alias Rocketpay.User
  alias Rocketpay.Repo
  alias Rocketpay.Users.Create

  describe "call/1" do
    test "when all params are valid, returns a user" do
      params = %{
        name: "Jonathan",
        password: "teste1",
        nickname: "jonathan",
        email: "jonathan.videira@gmail.com",
        age: 27
      }

      {:ok, %User{id: user_id}} = Create.call(params)
      user = Repo.get(User, user_id)

      assert %User{name: "Jonathan", age: 27, id: ^user_id} = user
    end

    test "when there are invalid params, returns a error changeset" do
      params = %{
        name: "Jonathan",
        nickname: "jonathan",
        email: "jonathan.videira@gmail.com",
        age: 15
      }

      {:error, changeset} = Create.call(params)

      expected_response = %{
        age: ["must be greater than or equal to 18"],
        password: ["can't be blank"]
      }

      assert errors_on(changeset) == expected_response
    end
  end
end
