# Planetarium Ticketing System

## Overview

This is a command-line ticketing system designed for a planetarium. It allows vendors to add tickets to a shared pool and customers to purchase them. The application supports registering new users (vendors and customers), logging in, purchasing, canceling, and viewing tickets.

The system uses a configuration file (`config.json`) to store parameters such as total tickets, ticket release rate, customer retrieval rate, and maximum ticket capacity.

## Features

### Vendor Features

1. **Register as a vendor.**
2. **Start and stop releasing tickets into the pool.**
3. **View the current status of the ticket pool.**

### Customer Features

1. **Register as a customer.**
2. **Purchase tickets** (asynchronously, simulating the process).
3. **Cancel previously purchased tickets.**
4. **View purchased tickets.**
5. **View current ticket pool status.**

### Configuration Management

- **Load configuration from `config.json`.**
- If not present, prompt the user to input system configuration at startup.
- **Save new configuration settings back to `config.json`.**

## System Requirements

- **Java 8+ (JDK)**
- `users.txt` file for storing user data (created automatically when new users are registered).
- `config.json` for configuration (created automatically if not present).

## How to Run

### Compile the Code

```bash
javac *.java
