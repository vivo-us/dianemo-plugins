type QueryClassificationType = "ADVERSARIAL_QUERY" | "NON_ANSWER_SEEKING_QUERY";

export type SessionState = "IN_PROGRESS" | "STATE_UNSPECIFIED";

export interface GetAnswerData {
  query: { text: string };
  groundingSpec?: {
    includeGroundingSupports?: boolean;
  };
  queryUnderstandingSpec?: {
    queryClassificationSpec: {
      types: QueryClassificationType[];
    };
  };
  session?: string;
}

export interface GetAnswerResponse {
  answer: {
    state: string;
    answerText: string;
    steps: GetAnswerStep[];
    references?: GetAnswerReference[];
    queryUnderstandingInfo?: {
      queryClassificationInfo: {
        type: QueryClassificationType;
      }[];
    };
    groundingScore?: number;
    groundingSupports?: GetAnswerGroundingSupport[];
  };
  answerQueryToken: string;
}

export interface GetAnswerStep {
  state: string;
  description: string;
  actions: GetAnswerStepAction[];
}

export interface GetAnswerStepAction {
  searchAction?: {
    query: string;
  };
  observation?: {
    searchResults: GetAnswerStepActionSearchResult[];
  };
}

export interface GetAnswerStepActionSearchResult {
  document: string;
  uri: string;
  title: string;
  snippetInfo: GetAnswerStepActionSnippetInfo[];
}

export interface GetAnswerStepActionSnippetInfo {
  snippet: string;
  snippetStatus: string;
}

/**
 * Google fills exactly one of the three fields, chosen by how the grounding
 * document was ingested — a chunked unstructured document, an unchunked one, or
 * a structured datastore row. Declaring `chunkInfo` outright made every other
 * case look like a chunk with a missing body, hence the union.
 */
export type GetAnswerReference =
  | {
      chunkInfo: GetAnswerChunkInfo;
      unstructuredDocumentInfo?: never;
      structuredDocumentInfo?: never;
    }
  | {
      unstructuredDocumentInfo: GetAnswerUnstructuredDocumentInfo;
      chunkInfo?: never;
      structuredDocumentInfo?: never;
    }
  | {
      structuredDocumentInfo: GetAnswerStructuredDocumentInfo;
      chunkInfo?: never;
      unstructuredDocumentInfo?: never;
    };

export interface GetAnswerChunkInfo {
  /** Optional because it has been observed absent, not because Google says so. */
  chunk?: string;
  content: string;
  relevanceScore?: number;
  documentMetadata?: GetAnswerDocumentMetadata;
}

export interface GetAnswerUnstructuredDocumentInfo {
  document: string;
  uri?: string;
  title?: string;
  chunkContents?: {
    content: string;
    pageIdentifier?: string;
    relevanceScore?: number;
  }[];
  structData?: Record<string, unknown>;
}

export interface GetAnswerStructuredDocumentInfo {
  document: string;
  structData?: Record<string, unknown>;
}

export interface GetAnswerDocumentMetadata {
  document?: string;
  uri?: string;
  title?: string;
  pageIdentifier?: string;
  structData?: Record<string, unknown>;
}

export interface GetAnswerGroundingSupport {
  startIndex?: string;
  endIndex: string;
  groundingScore: number;
  groundingCheckRequired: boolean;
  sources: {
    referenceId: string;
  }[];
}

export interface CreateSessionResponse {
  name: string;
  state: SessionState;
  userPseudoId: string;
  startTime: string;
  endTime: string;
}
