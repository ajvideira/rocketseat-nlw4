defmodule Rocketpay.Accounts.Operation do
  alias Ecto.{Multi, UUID}
  alias Rocketpay.{Account}

  def call(%{"id" => id, "value" => value}, operation) do
    operation_get_account = transaction_operation_name("get_account", operation)
    operation_update_balance = transaction_operation_name("update_balance", operation)

    Multi.new()
    |> Multi.run(operation_get_account, fn repo, _changes -> verify_account(repo, id) end)
    |> Multi.run(operation_update_balance, fn repo, changes ->
      account = Map.get(changes, operation_get_account)
      update_balance(repo, account, value, operation)
    end)
  end

  defp verify_account(repo, id) do
    id
    |> cast_binary_id()
    |> get_account(repo)
  end

  defp cast_binary_id(id) do
    id
    |> UUID.cast()
    |> handle_binary_id()
  end

  defp handle_binary_id(:error), do: {:error, "Invalid account ID"}
  defp handle_binary_id({:ok, value}), do: value

  defp get_account({:error, _reason} = error, _repo), do: error
  defp get_account(id, repo) do
    case repo.get(Account, id) do
      nil -> {:error, "Account not found!"}
      account -> {:ok, account}
    end
  end

  defp update_balance(repo, account, value, operation) do
    account
    |> operate_values(value, operation)
    |> update_account(repo, account)
  end

  defp operate_values(%Account{balance: balance}, value, operation) do
    value
    |> Decimal.cast()
    |> handle_decimal(balance, operation)
  end

  defp handle_decimal(:error, _balance, _operation), do: {:error, "Invalid deposit value!"}
  defp handle_decimal({:ok, value}, balance, :deposit), do: Decimal.add(balance, value)
  defp handle_decimal({:ok, value}, balance, :withdraw), do: Decimal.sub(balance, value)

  defp update_account({:error, _reason} = error, _repo, _account), do: error
  defp update_account(value, repo, account) do
    params = %{balance: value}
    account
    |> Account.changeset(params)
    |> repo.update()
  end

  defp transaction_operation_name(transaction_operation, operation) do
    "#{transaction_operation}_#{Atom.to_string(operation)}"
    |> String.to_atom()
  end
end
