-- 사용자별 메모장 테이블 생성
CREATE TABLE user_memos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    memo_content TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 사용자 ID에 대한 인덱스 생성
CREATE INDEX idx_user_memos_user_id ON user_memos(user_id);

-- 사용자별로 하나의 메모만 가지도록 제약 조건 추가
CREATE UNIQUE INDEX idx_user_memos_unique_user ON user_memos(user_id);

-- RLS(Row Level Security) 정책 활성화
ALTER TABLE user_memos ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 메모만 볼 수 있는 정책
CREATE POLICY "Users can view own memos" ON user_memos
    FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 메모만 생성할 수 있는 정책
CREATE POLICY "Users can create own memos" ON user_memos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 메모만 수정할 수 있는 정책
CREATE POLICY "Users can update own memos" ON user_memos
    FOR UPDATE USING (auth.uid() = user_id);

-- 사용자는 자신의 메모만 삭제할 수 있는 정책
CREATE POLICY "Users can delete own memos" ON user_memos
    FOR DELETE USING (auth.uid() = user_id);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_user_memos_updated_at
    BEFORE UPDATE ON user_memos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 