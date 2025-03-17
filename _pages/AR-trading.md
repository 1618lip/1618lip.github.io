### **Title: Integrated AR Signal Trading Engine & Backtester**

**Overview:**  
This project builds an end-to-end quantitative trading system by combining an autoregressive (AR) model–based signal generator with a trading strategy backtesting engine. It fetches market data via API requests, computes AR model coefficients using the Levinson-Durbin algorithm, generates trading signals, and then backtests these signals against historical data.

### **Key Components:**
1. **Data Acquisition Module:**  
   - Uses **libcurl** to fetch historical market data (e.g., from Alpha Vantage).
   - Parses the JSON response using **jsoncpp**.

2. **AR Model Signal Generator:**  
   - Implements the Levinson-Durbin algorithm to compute AR model coefficients.
   - Uses the model to perform forward predictions (and a conceptual backward prediction).

3. **Trading Strategy Backtesting Engine:**  
   - Simulates trading based on the generated signals.
   - Evaluates performance metrics like profit/loss, drawdown, etc.

4. **Integration Layer:**  
   - Connects signal generation with the backtesting engine.
   - Allows parameter tuning for both the AR model and backtesting settings.

### **Technologies & Tools:**
- **C++ (C++11 or later):** Core programming language.
- **libcurl:** For making HTTP requests to retrieve market data.
- **jsoncpp:** To parse JSON responses.
- **CMake:** Build system to manage compilation and dependencies.
- **Optional:**  
  - **Eigen/Armadillo:** For advanced numerical operations.
  - **Google Test (gtest):** For unit testing.
  - **Plotting Libraries:** For data visualization (e.g., Matplotlib-cpp or exporting data for Python).

---

## Directory Structure

```
IntegratedARTrading/
├── CMakeLists.txt
└── src
    ├── main.cpp
    ├── ARModel.h
    ├── ARModel.cpp
    ├── DataFetcher.h
    └── DataFetcher.cpp
```

---

## Starter Code

### **CMakeLists.txt**

```cmake
cmake_minimum_required(VERSION 3.10)
project(IntegratedARTrading)

set(CMAKE_CXX_STANDARD 11)

# Find cURL package
find_package(CURL REQUIRED)

include_directories(${CURL_INCLUDE_DIRS})

# Add the source files
add_executable(IntegratedARTrading 
    src/main.cpp 
    src/ARModel.cpp 
    src/DataFetcher.cpp
)

# Link against cURL
target_link_libraries(IntegratedARTrading ${CURL_LIBRARIES})
```

### **src/DataFetcher.h**

```cpp
#ifndef DATAFETCHER_H
#define DATAFETCHER_H

#include <string>
#include <vector>

class DataFetcher {
public:
    // Fetch historical market data (e.g., closing prices)
    std::vector<double> fetchMarketData(const std::string& symbol, const std::string& apiKey);
};

#endif
```

### **src/DataFetcher.cpp**

```cpp
#include "DataFetcher.h"
#include <curl/curl.h>
#include <sstream>
#include <iostream>
#include <json/json.h>  // Requires jsoncpp library

// Callback function to handle data received via cURL
static size_t WriteCallback(void* contents, size_t size, size_t nmemb, void* userp) {
    ((std::string*)userp)->append((char*)contents, size * nmemb);
    return size * nmemb;
}

std::vector<double> DataFetcher::fetchMarketData(const std::string& symbol, const std::string& apiKey) {
    std::vector<double> prices;
    CURL* curl = curl_easy_init();
    std::string readBuffer;
    if(curl) {
        // Example URL for Alpha Vantage (adjust parameters as needed)
        std::string url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" 
                          + symbol + "&apikey=" + apiKey + "&outputsize=compact";
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
        CURLcode res = curl_easy_perform(curl);
        if(res != CURLE_OK) {
            std::cerr << "cURL error: " << curl_easy_strerror(res) << std::endl;
        }
        curl_easy_cleanup(curl);
    }

    // Parse the JSON response using jsoncpp
    Json::Value jsonData;
    Json::CharReaderBuilder readerBuilder;
    std::string errs;
    std::istringstream s(readBuffer);
    if (Json::parseFromStream(readerBuilder, s, &jsonData, &errs)) {
        // Data typically under "Time Series (Daily)"
        const Json::Value timeSeries = jsonData["Time Series (Daily)"];
        for (const auto& date : timeSeries.getMemberNames()) {
            double close = std::stod(timeSeries[date]["4. close"].asString());
            prices.push_back(close);
        }
    } else {
        std::cerr << "Failed to parse JSON: " << errs << std::endl;
    }
    return prices;
}
```

### **src/ARModel.h**

```cpp
#ifndef ARMODEL_H
#define ARMODEL_H

#include <vector>

class ARModel {
public:
    // Construct the model with data and specified order
    ARModel(const std::vector<double>& data, int order);

    // Compute AR coefficients using the Levinson-Durbin algorithm
    bool computeCoefficients();

    // Predict next value using the AR model (forward prediction)
    double forwardPredict();

    // A conceptual demonstration of a backward prediction
    double backwardPredict();

    // Get the AR coefficients
    const std::vector<double>& getCoefficients() const;

private:
    std::vector<double> data_;
    int order_;
    std::vector<double> coefficients_;
    std::vector<double> autocorrelation_;

    // Helper: compute autocorrelation values up to the given order
    void computeAutocorrelation();
};

#endif
```

### **src/ARModel.cpp**

```cpp
#include "ARModel.h"
#include <cmath>
#include <iostream>

ARModel::ARModel(const std::vector<double>& data, int order)
    : data_(data), order_(order) {
}

void ARModel::computeAutocorrelation() {
    int n = data_.size();
    autocorrelation_.resize(order_ + 1, 0.0);
    for (int lag = 0; lag <= order_; ++lag) {
        double sum = 0.0;
        for (int i = lag; i < n; ++i) {
            sum += data_[i] * data_[i - lag];
        }
        autocorrelation_[lag] = sum / n;
    }
}

bool ARModel::computeCoefficients() {
    computeAutocorrelation();
    std::vector<double> a(order_ + 1, 0.0);
    std::vector<double> e(order_ + 1, 0.0);
    a[0] = 1.0;
    e[0] = autocorrelation_[0];

    if (autocorrelation_[0] == 0) {
        std::cerr << "Zero lag autocorrelation. Cannot compute coefficients." << std::endl;
        return false;
    }

    // Levinson-Durbin recursion
    for (int k = 1; k <= order_; ++k) {
        double lambda = 0.0;
        for (int j = 1; j < k; ++j) {
            lambda += a[j] * autocorrelation_[k - j];
        }
        lambda = (autocorrelation_[k] - lambda) / e[k - 1];
        
        a[k] = lambda;
        for (int j = 1; j < k; ++j) {
            a[j] = a[j] - lambda * a[k - j];
        }
        e[k] = e[k - 1] * (1.0 - lambda * lambda);
    }

    // Store coefficients (skip a[0] as it is 1.0 by convention)
    coefficients_.resize(order_);
    for (int i = 0; i < order_; ++i) {
        coefficients_[i] = a[i + 1];
    }

    return true;
}

double ARModel::forwardPredict() {
    int n = data_.size();
    if (n < order_) {
        std::cerr << "Insufficient data for prediction." << std::endl;
        return 0.0;
    }
    double prediction = 0.0;
    for (int i = 0; i < order_; ++i) {
        prediction += coefficients_[i] * data_[n - i - 1];
    }
    return prediction;
}

double ARModel::backwardPredict() {
    int n = data_.size();
    if (n < order_) {
        std::cerr << "Insufficient data for backward prediction." << std::endl;
        return 0.0;
    }
    double prediction = 0.0;
    for (int i = 0; i < order_; ++i) {
        prediction += coefficients_[i] * data_[i];
    }
    return prediction;
}

const std::vector<double>& ARModel::getCoefficients() const {
    return coefficients_;
}
```

### **src/main.cpp**

```cpp
#include <iostream>
#include "DataFetcher.h"
#include "ARModel.h"

int main() {
    // --- Configuration ---
    std::string symbol = "AAPL";            // Example: Apple stock
    std::string apiKey = "YOUR_API_KEY";      // Replace with your Alpha Vantage API key
    int order = 4;                          // AR model order

    // --- Fetch market data ---
    DataFetcher fetcher;
    std::vector<double> marketData = fetcher.fetchMarketData(symbol, apiKey);
    if (marketData.empty()) {
        std::cerr << "Failed to retrieve market data." << std::endl;
        return -1;
    }
    std::cout << "Retrieved " << marketData.size() << " data points." << std::endl;

    // --- Compute AR Model Coefficients ---
    ARModel model(marketData, order);
    if (!model.computeCoefficients()) {
        std::cerr << "Error computing AR model coefficients." << std::endl;
        return -1;
    }
    std::cout << "AR Coefficients: ";
    for (const auto& coef : model.getCoefficients()) {
        std::cout << coef << " ";
    }
    std::cout << std::endl;

    // --- Generate Predictions ---
    double forwardPrediction = model.forwardPredict();
    double backwardPrediction = model.backwardPredict();

    std::cout << "Forward Prediction (next value): " << forwardPrediction << std::endl;
    std::cout << "Backward Prediction (using initial values): " << backwardPrediction << std::endl;

    // --- Backtesting Placeholder ---
    // Here you would integrate the trading signals into a backtesting engine,
    // simulate trades, and compute performance metrics.
    // Example (pseudo-code):
    //   if (forwardPrediction > marketData.back()) { executeBuy(); }
    //   else { executeSell(); }

    return 0;
}
```

---

## Instructions

1. **Install Dependencies:**  
   - **libcurl:** Install via your package manager (e.g., `sudo apt-get install libcurl4-openssl-dev` on Ubuntu).
   - **jsoncpp:** Install via your package manager or build from source (e.g., `sudo apt-get install libjsoncpp-dev` on Ubuntu).

2. **Project Setup:**  
   - Create a directory named `IntegratedARTrading` and create a `src` folder inside it.
   - Add the files as per the directory structure above.

3. **Build the Project:**  
   - In the project root directory, create a build directory:
     ```bash
     mkdir build && cd build
     ```
   - Run CMake and build:
     ```bash
     cmake ..
     make
     ```
   - This should generate an executable named `IntegratedARTrading`.

4. **Run the Project:**  
   - Replace `"YOUR_API_KEY"` in `main.cpp` with your actual API key.
   - Execute the project:
     ```bash
     ./IntegratedARTrading
     ```

5. **Next Steps:**  
   - **Enhance the Backtester:** Expand the main function or create new modules to simulate trade execution based on the AR signals.
   - **Visualization:** Integrate a plotting library or export data for analysis in Python.
   - **Unit Testing:** Consider adding Google Test to write tests for the AR model and data fetching modules.
   - **Parameter Tuning:** Allow user input or configuration files to adjust model order and other settings.

This starter package should give you a solid foundation to build a comprehensive quant trading tool that combines advanced signal generation with robust strategy backtesting—all in C++. Happy coding!
