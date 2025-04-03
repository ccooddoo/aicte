import streamlit as st
import pandas as pd
import os

# **फंक्शन: CSV फाइल लोड करणे**
@st.cache_data
def load_chapter_data(chapter_number):
    file_path = f"adhyaya_{chapter_number}.csv"
    if os.path.exists(file_path):
        return pd.read_csv(file_path).to_dict("records")
    return []

# **स्टेट सेव्ह करणे**
if "current_page" not in st.session_state:
    st.session_state.current_page = "cover"
if "selected_chapter" not in st.session_state:
    st.session_state.selected_chapter = None
if "shloka_index" not in st.session_state:
    st.session_state.shloka_index = 0

# **मुखपृष्ठ (Cover Page)**
if st.session_state.current_page == "cover":
    st.image("cover.jpg", use_column_width=True)  # मुखपृष्ठ दाखवा
    if st.button("📖 पुढे जा"):
        st.session_state.current_page = "index"

# **अनुक्रमणिका (Index Page)**
elif st.session_state.current_page == "index":
    st.title("📚 अनुक्रमणिका")
    for i in range(1, 5):  # तू सर्व `adhyaya_x.csv` जोडू शकतोस
        if st.button(f"📖 अध्याय {i} वाचा"):
            st.session_state.selected_chapter = i
            st.session_state.shloka_index = 0
            st.session_state.current_page = "chapter"
    if st.button("⬅ मागे (मुखपृष्ठ)"):
        st.session_state.current_page = "cover"

# **अध्याय वाचन (श्लोक आणि अर्थ)**
elif st.session_state.current_page == "chapter":
    chapter_number = st.session_state.selected_chapter
    shloka_list = load_chapter_data(chapter_number)
    total_shlokas = len(shloka_list)

    st.title(f"📖 अध्याय {chapter_number}")

    if total_shlokas > 0:
        shloka_data = shloka_list[st.session_state.shloka_index]
        st.markdown(f"### 🕉 **संस्कृत श्लोक:**  \n✍️ *{shloka_data['Shloka']}*")
        st.markdown(f"🔹 **मराठीत अर्थ:**  \n_{shloka_data['Meaning']}_")

    # **नेव्हिगेशन (`>` `<`)**
    col1, col2, col3 = st.columns([1, 2, 1])
    with col1:
        if st.session_state.shloka_index > 0:
            if st.button("⬅ मागे"):
                st.session_state.shloka_index -= 1
    with col3:
        if st.session_state.shloka_index < total_shlokas - 1:
            if st.button("➡ पुढे"):
                st.session_state.shloka_index += 1

    st.markdown("---")
    col4, col5 = st.columns([1, 1])
    with col4:
        if st.button("⬅ अनुक्रमणिका"):
            st.session_state.current_page = "index"
    with col5:
        if st.button("🏠 मुख्यपृष्ठ"):
            st.session_state.current_page = "cover"
