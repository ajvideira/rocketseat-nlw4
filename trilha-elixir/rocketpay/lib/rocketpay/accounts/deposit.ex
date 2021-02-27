defmodule Rocketpay.Accounts.Deposit do
  alias Ecto.{Multi, UUID}
  alias Rocketpay.{Account, Repo}

  def call(%{"id" => id, "value" => value}) do
    Multi.new()
    |> Multi.run(:get_account, fn repo, _changes ->
      cast_binary_id(id)
      |> get_account(repo)
    end)
    |> Multi.run(:update_balance, fn repo, %{get_account: account} ->
      update_balance(repo, account, value)
    end)
    |> run_transaction()
  end

  defp cast_binary_id(id) do
    id
    |> UUID.cast()
    |> handle_binary_id()
  end

  defp get_account({:error, _reason} = error, _repo), do: error
  defp get_account(id, repo) do
    case repo.get(Account, id) do
      nil -> {:error, "Account not found!"}
      account -> {:ok, account}
    end
  end

  defp handle_binary_id(:error), do: {:error, "Invalid account ID"}
  defp handle_binary_id({:ok, value}), do: value

  defp update_balance(repo, account, value) do
    account
    |> sum_values(value)
    |> update_account(repo, account)
  end

  defp sum_values(%Account{balance: balance}, value) do
    value
    |> Decimal.cast()
    |> handle_decimal(balance)
  end

  defp handle_decimal(:error, _balance), do: {:error, "Invalid deposit value!"}
  defp handle_decimal({:ok, value}, balance), do: Decimal.add(balance, value)

  defp update_account({:error, _reason} = error, _repo, _account), do: error
  defp update_account(value, repo, account) do
    params = %{balance: value}
    account
    |> Account.changeset(params)
    |> repo.update()
  end

  defp run_transaction(multi) do
    case Repo.transaction(multi) do
      {:error, _operation, reason, _changes} -> {:error, reason}
      {:ok, %{update_balance: account}} -> {:ok, account}
    end
  end
end
