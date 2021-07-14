use deltachat::accounts::Accounts;
use deltachat::config::Config;
use deltachat::constants::*;
use deltachat::contact::Contact;

use anyhow::Result;
use jsonrpc_core::serde_json::{json, Value};
use serde::Deserialize;

mod return_type;
use return_type::*;

enum Account {
    Configured {
        id: u32,
        display_name: Option<String>,
        addr: Option<String>,
        // size: u32,
        profile_image: Option<String>, // TODO: This needs to be converted to work with blob http server.
        color: String,
    },
    Unconfigured {
        id: u32,
    },
}

impl ReturnType for Account {
    fn get_typescript_type() -> String {
        "{ id: number } | { id: number, display_name: string | null, addr: string | null, profile_image: string | null, color: string }".to_owned()
    }

    fn into_json_value(self) -> Value {
        match self {
            Account::Unconfigured { id } => json!({ "id": id }),
            Account::Configured {
                id,
                display_name,
                addr,
                profile_image,
                color,
            } => json!({
               "id": id,
               "display_name": display_name,
               "addr": addr,
               "profile_image": profile_image,
               "color": color
            }),
        }
    }
}

fn color_int_to_hex_string(color: u32) -> String {
    todo!()
    // /**
    // * @param integerColor expects a 24bit rgb integer (left to right: 8bits red, 8bits green, 8bits blue)
    // */
    // export function integerToHexColor(integerColor: number) {
    //  return '#' + (integerColor + 16777216).toString(16).substring(1)
    // }
}

#[derive(Clone, Debug)]
pub struct CommandApi {
    manager: Accounts,
}

impl CommandApi {
    pub fn new(am: &Accounts) -> Self {
        CommandApi {
            manager: am.clone(),
        }
    }
}

impl CommandApi {
    // ---------------------------------------------
    //              Account Management
    // ---------------------------------------------

    async fn add_account(&self) -> Result<u32> {
        self.manager.add_account().await
    }

    async fn get_all_account_ids(&self) -> Vec<u32> {
        self.manager.get_all().await
    }

    async fn get_all_accounts(&self) -> Result<Vec<Account>> {
        let mut accounts = Vec::new();
        for id in self.manager.get_all().await {
            let context_option = self.manager.get_account(id).await;
            if let Some(ctx) = context_option {
                if ctx.is_configured().await? {
                    accounts.push(Account::Configured {
                        id,
                        display_name: ctx.get_config(Config::Displayname).await?,
                        addr: ctx.get_config(Config::Addr).await?,
                        profile_image: ctx.get_config(Config::Selfavatar).await?,
                        // dc.getContact(C.DC_CONTACT_ID_SELF).color
                        color: color_int_to_hex_string(
                            Contact::get_by_id(&ctx, DC_CONTACT_ID_SELF)
                                .await?
                                .get_color(),
                        ),
                    });
                } else {
                    accounts.push(Account::Unconfigured { id });
                }
            } else {
                println!("account with id {} doesn't exist anymore", id);
            }
        }
        return Ok(accounts);
    }

    async fn select_account(&self, id: u32) -> Result<()> {
        self.manager.select_account(id).await
    }

    // ---------------------------------------------
    // Functions for the selected Account / Context
    // ---------------------------------------------

    // TODO add a function where an parameter is a custom struct / object
}

// what should be generated later
// GENERATED
#[allow(non_camel_case_types)]
#[derive(Deserialize)]
struct select_account_params {
    id: u32,
}

// GENERATED
impl CommandApi {
    pub fn get_json_rpc_io(&self) -> jsonrpc_core::IoHandler {
        let mut io = jsonrpc_core::IoHandler::new();

        let self_ref = self.clone();
        io.add_method("add_account", move |_: jsonrpc_core::Params| {
            let self_ref = self_ref.clone();
            async move {
                let result = self_ref.add_account().await;
                result_convert_anyhow_into_json_rpc(result)
            }
        });

        let self_ref = self.clone();
        io.add_method("get_all_account_ids", move |_: jsonrpc_core::Params| {
            let self_ref = self_ref.clone();
            async move {
                let result = self_ref.get_all_account_ids().await;
                jsonrpc_core::Result::Ok(result.into_json_value())
            }
        });

        let self_ref = self.clone();
        io.add_method("get_all_accounts", move |_: jsonrpc_core::Params| {
            let self_ref = self_ref.clone();
            async move {
                let result = self_ref.get_all_accounts().await;
                result_convert_anyhow_into_json_rpc(result)
            }
        });

        let self_ref = self.clone();
        io.add_method("select_account", move |param: jsonrpc_core::Params| {
            let self_ref = self_ref.clone();
            async move {
                let parameters: select_account_params = param.parse()?;
                let result = self_ref.select_account(parameters.id).await;
                result_convert_anyhow_into_json_rpc(result)
            }
        });

        io
    }

    pub fn get_typescript() -> String {
        let mut ts = String::new();
        ts.push_str("// THIS FILE WAS AUTOGENERATED DO NOT EDIT MANUALLY!, unless you know what you are doing...\n");
        ts.push_str("type todo = any;\n");
        // custom return types

        ts.push_str(&format!(
            "export type {} = {};\n",
            "AccountType",
            Account::get_typescript_type()
        ));

        // functions - prelude
        ts.push_str("\
            export class RawApi {\n\
                \t/**/\n\
                \t * @param json_transport function that executes a jsonrpc call and throws an error if one occured\n\
                \t */\n\
                \tconstructor (private json_transport: (methode: string, params?: any) => Promise<any>) {}\n"
        );

        // functions

        ts.push_str(&format!(
            "\tpublic async function {method_name}({args}):Promise<{return_type}>{{\n\
                \t\treturn await this.json_transport(\"{method_name}\", {params});\n\
                \t}}\n",
            method_name = "add_account",
            args = "",
            return_type = u32::get_typescript_type(),
            params = "undefined"
        ));
        ts.push_str(&format!(
            "\tpublic async function {method_name}({args}):Promise<{return_type}>{{\n\
                \t\treturn await this.json_transport(\"{method_name}\", {params});\n\
                \t}}\n",
            method_name = "get_all_account_ids",
            args = "",
            return_type = Vec::<u32>::get_typescript_type(),
            params = "undefined"
        ));
        ts.push_str(&format!(
            "\tpublic async function {method_name}({args}):Promise<{return_type}>{{\n\
                \t\treturn await this.json_transport(\"{method_name}\", {params});\n\
                \t}}\n",
            method_name = "get_all_accounts",
            args = "",
            return_type = Vec::<Account>::get_typescript_type(),
            params = "undefined"
        ));

        let args = format!("{}:{}", "id", u32::get_typescript_type());
        ts.push_str(&format!(
            "\tpublic async function {method_name}({args}):Promise<{return_type}>{{\n\
             \t\treturn await this.json_transport(\"{method_name}\", {params});\n\
             \t}}\n",
            method_name = "select_account",
            args = args,
            return_type = "",
            params = "{id}"
        ));

        ts.push_str("}");

        ts
    }
}
