// AUTO-GENERATED by yerpc-derive

import * as T from "./types.js"
import * as RPC from "./jsonrpc.js"

type RequestMethod = (method: string, params?: RPC.Params) => Promise<unknown>;
type NotificationMethod = (method: string, params?: RPC.Params) => void;

interface Transport {
  request: RequestMethod,
  notification: NotificationMethod
}

export class RawClient {
  constructor(private _transport: Transport) {}

  public checkEmailValidity(email: string): Promise<boolean> {
    return (this._transport.request('check_email_validity', [email] as RPC.Params)) as Promise<boolean>;
  }
  public getSystemInfo(): Promise<Record<string,string>> {
    return (this._transport.request('get_system_info', [] as RPC.Params)) as Promise<Record<string,string>>;
  }
  public getProviderInfo(accountId: T.U32, email: string): Promise<(T.ProviderInfo|null)> {
    return (this._transport.request('get_provider_info', [accountId, email] as RPC.Params)) as Promise<(T.ProviderInfo|null)>;
  }
  public addAccount(): Promise<T.U32> {
    return (this._transport.request('add_account', [] as RPC.Params)) as Promise<T.U32>;
  }
  public removeAccount(accountId: T.U32): Promise<null> {
    return (this._transport.request('remove_account', [accountId] as RPC.Params)) as Promise<null>;
  }
  public getAllAccountIds(): Promise<(T.U32)[]> {
    return (this._transport.request('get_all_account_ids', [] as RPC.Params)) as Promise<(T.U32)[]>;
  }
  public getAccountInfo(accountId: T.U32): Promise<T.Account> {
    return (this._transport.request('get_account_info', [accountId] as RPC.Params)) as Promise<T.Account>;
  }
  public getAllAccounts(): Promise<(T.Account)[]> {
    return (this._transport.request('get_all_accounts', [] as RPC.Params)) as Promise<(T.Account)[]>;
  }
  public selectAccount(id: T.U32): Promise<null> {
    return (this._transport.request('select_account', [id] as RPC.Params)) as Promise<null>;
  }
  public getSelectedAccountId(): Promise<(T.U32|null)> {
    return (this._transport.request('get_selected_account_id', [] as RPC.Params)) as Promise<(T.U32|null)>;
  }
  public isConfigured(accountId: T.U32): Promise<boolean> {
    return (this._transport.request('is_configured', [accountId] as RPC.Params)) as Promise<boolean>;
  }
  public getInfo(accountId: T.U32): Promise<Record<string,string>> {
    return (this._transport.request('get_info', [accountId] as RPC.Params)) as Promise<Record<string,string>>;
  }
  public setConfig(accountId: T.U32, key: string, value: (string|null)): Promise<null> {
    return (this._transport.request('set_config', [accountId, key, value] as RPC.Params)) as Promise<null>;
  }
  public batchSetConfig(accountId: T.U32, config: Record<string,(string|null)>): Promise<null> {
    return (this._transport.request('batch_set_config', [accountId, config] as RPC.Params)) as Promise<null>;
  }
  public getConfig(accountId: T.U32, key: string): Promise<(string|null)> {
    return (this._transport.request('get_config', [accountId, key] as RPC.Params)) as Promise<(string|null)>;
  }
  public batchGetConfig(accountId: T.U32, keys: (string)[]): Promise<Record<string,(string|null)>> {
    return (this._transport.request('batch_get_config', [accountId, keys] as RPC.Params)) as Promise<Record<string,(string|null)>>;
  }
  public configure(accountId: T.U32): Promise<null> {
    return (this._transport.request('configure', [accountId] as RPC.Params)) as Promise<null>;
  }
  public stopOngoingProcess(accountId: T.U32): Promise<null> {
    return (this._transport.request('stop_ongoing_process', [accountId] as RPC.Params)) as Promise<null>;
  }
  public autocryptInitiateKeyTransfer(accountId: T.U32): Promise<string> {
    return (this._transport.request('autocrypt_initiate_key_transfer', [accountId] as RPC.Params)) as Promise<string>;
  }
  public autocryptContinueKeyTransfer(accountId: T.U32, messageId: T.U32, setupCode: string): Promise<null> {
    return (this._transport.request('autocrypt_continue_key_transfer', [accountId, messageId, setupCode] as RPC.Params)) as Promise<null>;
  }
  public getChatlistEntries(accountId: T.U32, listFlags: T.U32, queryString: (string|null), queryContactId: (T.U32|null)): Promise<(T.ChatListEntry)[]> {
    return (this._transport.request('get_chatlist_entries', [accountId, listFlags, queryString, queryContactId] as RPC.Params)) as Promise<(T.ChatListEntry)[]>;
  }
  public getChatlistItemsByEntries(accountId: T.U32, entries: (T.ChatListEntry)[]): Promise<Record<T.U32,T.ChatListItemFetchResult>> {
    return (this._transport.request('get_chatlist_items_by_entries', [accountId, entries] as RPC.Params)) as Promise<Record<T.U32,T.ChatListItemFetchResult>>;
  }
  public chatlistGetFullChatById(accountId: T.U32, chatId: T.U32): Promise<T.FullChat> {
    return (this._transport.request('chatlist_get_full_chat_by_id', [accountId, chatId] as RPC.Params)) as Promise<T.FullChat>;
  }
  public acceptChat(accountId: T.U32, chatId: T.U32): Promise<null> {
    return (this._transport.request('accept_chat', [accountId, chatId] as RPC.Params)) as Promise<null>;
  }
  public blockChat(accountId: T.U32, chatId: T.U32): Promise<null> {
    return (this._transport.request('block_chat', [accountId, chatId] as RPC.Params)) as Promise<null>;
  }
  public messageListGetMessageIds(accountId: T.U32, chatId: T.U32, flags: T.U32): Promise<(T.U32)[]> {
    return (this._transport.request('message_list_get_message_ids', [accountId, chatId, flags] as RPC.Params)) as Promise<(T.U32)[]>;
  }
  public messageGetMessage(accountId: T.U32, messageId: T.U32): Promise<T.Message> {
    return (this._transport.request('message_get_message', [accountId, messageId] as RPC.Params)) as Promise<T.Message>;
  }
  public messageGetMessages(accountId: T.U32, messageIds: (T.U32)[]): Promise<Record<T.U32,T.Message>> {
    return (this._transport.request('message_get_messages', [accountId, messageIds] as RPC.Params)) as Promise<Record<T.U32,T.Message>>;
  }
  public contactsGetContact(accountId: T.U32, contactId: T.U32): Promise<T.Contact> {
    return (this._transport.request('contacts_get_contact', [accountId, contactId] as RPC.Params)) as Promise<T.Contact>;
  }
  public contactsCreateContact(accountId: T.U32, email: string, name: (string|null)): Promise<T.U32> {
    return (this._transport.request('contacts_create_contact', [accountId, email, name] as RPC.Params)) as Promise<T.U32>;
  }
  public contactsCreateChatByContactId(accountId: T.U32, contactId: T.U32): Promise<T.U32> {
    return (this._transport.request('contacts_create_chat_by_contact_id', [accountId, contactId] as RPC.Params)) as Promise<T.U32>;
  }
  public contactsBlock(accountId: T.U32, contactId: T.U32): Promise<null> {
    return (this._transport.request('contacts_block', [accountId, contactId] as RPC.Params)) as Promise<null>;
  }
  public contactsUnblock(accountId: T.U32, contactId: T.U32): Promise<null> {
    return (this._transport.request('contacts_unblock', [accountId, contactId] as RPC.Params)) as Promise<null>;
  }
  public contactsGetBlocked(accountId: T.U32): Promise<(T.Contact)[]> {
    return (this._transport.request('contacts_get_blocked', [accountId] as RPC.Params)) as Promise<(T.Contact)[]>;
  }
  public contactsGetContactIds(accountId: T.U32, listFlags: T.U32, query: (string|null)): Promise<(T.U32)[]> {
    return (this._transport.request('contacts_get_contact_ids', [accountId, listFlags, query] as RPC.Params)) as Promise<(T.U32)[]>;
  }
  public contactsGetContacts(accountId: T.U32, listFlags: T.U32, query: (string|null)): Promise<(T.Contact)[]> {
    return (this._transport.request('contacts_get_contacts', [accountId, listFlags, query] as RPC.Params)) as Promise<(T.Contact)[]>;
  }
  public contactsGetContactsByIds(accountId: T.U32, ids: (T.U32)[]): Promise<Record<T.U32,T.Contact>> {
    return (this._transport.request('contacts_get_contacts_by_ids', [accountId, ids] as RPC.Params)) as Promise<Record<T.U32,T.Contact>>;
  }
  public miscSendTextMessage(accountId: T.U32, text: string, chatId: T.U32): Promise<T.U32> {
    return (this._transport.request('misc_send_text_message', [accountId, text, chatId] as RPC.Params)) as Promise<T.U32>;
  }

}
