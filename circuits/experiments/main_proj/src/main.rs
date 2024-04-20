
use std::fs;
use num::{BigInt, Num};
use serde_json::{Result, Value};

fn main(){
    let contents = fs::read_to_string("verification.key").expect("Should be able to read file");
    

    println!("Contents read: ");
    println!("As follows: \n{v}");
    println!("Hello world");
}
